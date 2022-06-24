import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFichier, Fichier } from '../fichier.model';
import { FichierService } from '../service/fichier.service';

@Injectable({ providedIn: 'root' })
export class FichierRoutingResolveService implements Resolve<IFichier> {
  constructor(protected service: FichierService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFichier> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((fichier: HttpResponse<Fichier>) => {
          if (fichier.body) {
            return of(fichier.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Fichier());
  }
}
