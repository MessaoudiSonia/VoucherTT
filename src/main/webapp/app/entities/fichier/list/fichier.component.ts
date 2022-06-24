import { Component, Injectable, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFichier } from '../fichier.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { FichierService } from '../service/fichier.service';
import { FichierDeleteDialogComponent } from '../delete/fichier-delete-dialog.component';
import { ConfirmPasswordComponent } from 'app/entities/fichier/confirm-password/confirm-password.component';
import * as dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { ElectronService } from 'ngx-electron';
import { PrintService } from 'app/layouts/print/impression/print.service';
import { DistributeurService } from 'app/entities/distributeur/service/distributeur.service';
import { IDistributeur } from 'app/entities/distributeur/distributeur.model';

@Component({
  selector: 'inetum-fichier',
  templateUrl: './fichier.component.html',
})
export class FichierComponent implements OnInit {
  fichiers?: IFichier[];
  searchedKeyword: string;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  distributeur?: IDistributeur;
  distributeurs?: IDistributeur[];
  page?: number;
  predicate!: string;
  ascending!: boolean;
  idInternalUser?: number;
  ngbPaginationPage = 1;
  p?: number = 1;

  constructor(
    protected fichierService: FichierService,
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

    this.fichierService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IFichier[]>) => {
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
      //get distributeur connect
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
          //get fichier by distributeur
          console.log('getPosteDis');
          if (this.distributeur?.nom !== undefined) {
            console.log('nomDis', this.distributeur?.nom);
            this.fichierService.findAll().subscribe(res => {
              this.fichiers = res;
              this.fichiers = this.fichiers.filter(dis => dis.distributeur?.id === this.distributeur?.id);
            });
          }
        }
      );
    } else {
      this.handleNavigation();
    }
  }

  trackId(index: number, item: IFichier): number {
    return item.id!;
  }
  fragment(id: any): void {
    this.router.navigate(['/fichier/fragment', id]);
  }
  dateFormat(date: dayjs.Dayjs | any): string {
    if (date != null) {
      return dayjs(date).format('D MMM YYYY HH:mm:ss');
    } else {
      return '';
    }
  }

  openPassword(fichier: IFichier): void {
    const modalRef = this.modalService.open(ConfirmPasswordComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.fichier = fichier;
    modalRef.closed.subscribe(reason => {
      console.log(reason);

      this.loadPage();
    });
  }

  delete(fichier: IFichier): void {
    const modalRef = this.modalService.open(FichierDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.fichier = fichier;
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
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

  protected onSuccess(data: IFichier[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/fichier'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.fichiers = data ?? [];
    console.log('liste', this.fichiers);

    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
