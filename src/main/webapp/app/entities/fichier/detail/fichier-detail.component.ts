import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFichier } from '../fichier.model';
import * as dayjs from 'dayjs';

@Component({
  selector: 'inetum-fichier-detail',
  templateUrl: './fichier-detail.component.html',
})
export class FichierDetailComponent implements OnInit {
  fichier: IFichier | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fichier }) => {
      this.fichier = fichier;
    });
  }

  previousState(): void {
    window.history.back();
  }

  dateFormat(date: dayjs.Dayjs | any): string {
    return dayjs(date).format('D MMM YYYY HH:mm:ss');
  }
}
