import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDistributeur, Distributeur } from '../distributeur.model';
import { DistributeurService } from '../service/distributeur.service';

@Injectable({ providedIn: 'root' })
export class DistributeurRoutingResolveService implements Resolve<IDistributeur> {
  constructor(protected service: DistributeurService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDistributeur> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((distributeur: HttpResponse<Distributeur>) => {
          if (distributeur.body) {
            return of(distributeur.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Distributeur());
  }
}
