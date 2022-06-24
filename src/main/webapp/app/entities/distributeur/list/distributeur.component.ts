import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDistributeur } from '../distributeur.model';
import { DistributeurService } from '../service/distributeur.service';
import { DistributeurDeleteDialogComponent } from '../delete/distributeur-delete-dialog.component';

@Component({
  selector: 'inetum-distributeur',
  templateUrl: './distributeur.component.html',
})
export class DistributeurComponent implements OnInit {
  distributeurs?: IDistributeur[];
  isLoading = false;
  searchedKeyword: string;
  p?: number = 1;

  constructor(protected distributeurService: DistributeurService, protected modalService: NgbModal) {
    this.searchedKeyword = '';
  }

  loadAll(): void {
    this.isLoading = true;

    this.distributeurService.query().subscribe(
      (res: HttpResponse<IDistributeur[]>) => {
        this.isLoading = false;
        this.distributeurs = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IDistributeur): number {
    return item.id!;
  }

  delete(distributeur: IDistributeur): void {
    const modalRef = this.modalService.open(DistributeurDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.distributeur = distributeur;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
