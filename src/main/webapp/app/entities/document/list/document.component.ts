import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDocument } from '../document.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { DocumentService } from '../service/document.service';
import { DocumentDeleteDialogComponent } from '../delete/document-delete-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ElectronService } from 'ngx-electron';
import { PrintService } from 'app/layouts/print/impression/print.service';
import { DistributeurService } from 'app/entities/distributeur/service/distributeur.service';
import { IDistributeur } from 'app/entities/distributeur/distributeur.model';
import * as dayjs from 'dayjs';

@Component({
  selector: 'inetum-document',
  templateUrl: './document.component.html',
})
export class DocumentComponent implements OnInit {
  documents?: IDocument[];
  distributeur?: IDistributeur;
  distributeurs?: IDistributeur[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  idInternalUser?: number;
  searchedKeyword: string;
  p?: number = 1;

  constructor(
    protected documentService: DocumentService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    private toastr: ToastrService,
    public printService: PrintService,
    private electronSevice: ElectronService,
    protected distributeurService: DistributeurService
  ) {
    this.searchedKeyword = '';
    try {
      this.electronSevice.ipcRenderer.on('verifClose', (evt: any, message1: any) => {
        console.log('length', Object.values(this.printService.printObservers).length);
        if (Object.values(this.printService.printObservers).length !== 0) {
          this.toastr.error('il ya une impression en cours');
        } else {
          this.electronSevice.ipcRenderer.send('noJob');
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.documentService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IDocument[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        () => {
          this.isLoading = false;
          this.onError();
        }
      );
  }

  ngOnInit(): void {
    if (localStorage.getItem('roleUser') === 'ROLE_DISTRIBUTEUR') {
      console.log('distributeur connecté');
      const id = localStorage.getItem('idInternalUser');
      this.idInternalUser = Number(id);

      console.log('distributeur connecté', this.idInternalUser);

      //get distributeur connecté
      this.distributeurService.findAll().subscribe(
        res => {
          this.distributeurs = res;
          this.distributeurs = this.distributeurs.filter(dis => dis.internalUser?.id === this.idInternalUser);
          console.log('liste', this.distributeurs);
          this.distributeur = this.distributeurs[0];
          console.log('distributeurConnecte', this.distributeur);
        },
        err => {
          console.log(err);
        },
        () => {
          this.documentService.findAll().subscribe(res => {
            this.documents = res;
            console.log('listeAvantFiltre', this.documents);
            this.documents = this.documents.filter(doc => doc.poste?.distributeur?.id === this.distributeur?.id);
            console.log('listeAprésFiltre', this.documents);
            this.documents.forEach((document: IDocument) => {
              document.creation = document.creation ? dayjs(document.creation) : undefined;
              document.impression = document.impression ? dayjs(document.impression) : undefined;
            });
          });
        }
      );
    } else {
      this.handleNavigation();
    }
  }

  trackId(index: number, item: IDocument): number {
    return item.id!;
  }

  delete(document: IDocument): void {
    const modalRef = this.modalService.open(DocumentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.document = document;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }
  getVal(val: any): number {
    return +val + 50;
  }
  getOffset(lot1: any, lot2: any): number {
    return lot2 - lot1;
  }

  resetCompteur(document: IDocument): void {
    document.compteur = 0;
    this.documentService.update(document).subscribe(
      res => {
        this.toastr.success('Compteur reinitialiser avec succes');
      },
      err => {
        this.toastr.error('Erreur de reinitialisation');
      }
    );
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = page !== null ? +page : 1;
      const sort = (params.get('sort') ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === 'asc';
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  protected onSuccess(data: IDocument[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/document'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.documents = data ?? [];
    this.ngbPaginationPage = this.page;
  }
  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
