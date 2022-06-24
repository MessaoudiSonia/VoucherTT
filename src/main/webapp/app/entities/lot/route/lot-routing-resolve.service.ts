import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILot, Lot } from '../lot.model';
import { LotService } from '../service/lot.service';

@Injectable({ providedIn: 'root' })
export class LotRoutingResolveService implements Resolve<ILot> {
  constructor(protected service: LotService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILot> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((lot: HttpResponse<Lot>) => {
          if (lot.body) {
            return of(lot.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Lot());
  }
}
