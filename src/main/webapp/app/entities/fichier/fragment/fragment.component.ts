import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from 'app/entities/document/service/document.service';
import { Fragment } from 'app/entities/fragment/fragment.model';
import { Fichier, IFichier } from 'app/entities/fichier/fichier.model';
import { IDocument } from 'app/entities/document/document.model';
import * as dayjs from 'dayjs';

@Component({
  selector: 'inetum-fragment',
  templateUrl: './fragment.component.html',
  styleUrls: ['./fragment.component.scss'],
})
export class FragmentComponent implements OnInit {
  fragments: Fragment[] = [];
  authorities: string[] = [];
  p?: number = 1;
  searchedKeyword: string;
  isLoading = false;
  page?: number;
  predicate!: string;
  ascending!: boolean;

  fichier: Fichier | null = null;
  id: any;

  total50: number | 0 = 0;
  total100: number | 0 = 0;

  constructor(protected router: Router, private documentsService: DocumentService, protected activatedRoute: ActivatedRoute) {
    this.searchedKeyword = '';
  }

  ngOnInit(): void {
    // this.activatedRoute.data.subscribe(({ fichier }) => {
    //   this.fichier = fichier;
    // });

    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    this.getEtat(this.id);
  }

  getEtat(id: any): void {
    this.documentsService.groupedByOffset(id).subscribe(
      res => {
        this.fragments = res;
      },
      error => {
        error;
      },
      () => {
        this.fragments.forEach(item => {
          this.total100 += item.count100;
          this.total50 += item.count50;
        });
      }
    );
  }

  previousState(): void {
    window.history.back();
  }

  getClass(status: any): string {
    if (status === 'FAILED') {
      return 'red';
    } else if (status === 'CONSUMED') {
      return 'green';
    } else if (status === 'SENT') {
      return 'orange';
    } else {
      return 'white';
    }
  }

  loadPage(): void {
    this.isLoading = true;
    this.getEtat(this.id);
    this.isLoading = false;
  }
}
