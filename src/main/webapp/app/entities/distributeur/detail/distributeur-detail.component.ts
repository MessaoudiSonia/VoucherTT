import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDistributeur } from '../distributeur.model';

@Component({
  selector: 'inetum-distributeur-detail',
  templateUrl: './distributeur-detail.component.html',
})
export class DistributeurDetailComponent implements OnInit {
  distributeur: IDistributeur | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ distributeur }) => {
      this.distributeur = distributeur;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
