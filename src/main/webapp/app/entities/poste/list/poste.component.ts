import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPoste } from '../poste.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { PosteService } from '../service/poste.service';
import { PosteDeleteDialogComponent } from '../delete/poste-delete-dialog.component';
import { DistributeurService } from 'app/entities/distributeur/service/distributeur.service';
import { IDistributeur } from 'app/entities/distributeur/distributeur.model';

@Component({
  selector: 'inetum-poste',
  templateUrl: './poste.component.html',
})
export class PosteComponent implements OnInit {
  postes?: IPoste[];
  distributeur?: IDistributeur;
  distributeurs?: IDistributeur[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  idInternalUser?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  searchedKeyword: string;
  role: string;
  p?: number = 1;

  constructor(
    protected posteService: PosteService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected distributeurService: DistributeurService
  ) {
    this.searchedKeyword = '';
    this.role = '';
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.posteService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IPoste[]>) => {
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

      //get distributeur conne
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
          //get poste by distributeur
          console.log('getPosteDis');
          if (this.distributeur?.nom !== undefined) {
            console.log('nomDis', this.distributeur?.nom);
            this.posteService.findAllByDistributeur(this.distributeur?.nom).subscribe(res => {
              this.postes = res;
            });
          }
          console.log('listeDesPostes', this.postes);
        }
      );
    } else {
      this.handleNavigation();
    }
  }

  trackId(index: number, item: IPoste): number {
    return item.id!;
  }

  delete(poste: IPoste): void {
    const modalRef = this.modalService.open(PosteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.poste = poste;
    // unsubscribe not needed because closed completes on modal close
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

  protected onSuccess(data: IPoste[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/poste'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.postes = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
