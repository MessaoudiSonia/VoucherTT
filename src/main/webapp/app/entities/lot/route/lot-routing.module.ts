import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LotComponent } from '../list/lot.component';
import { LotDetailComponent } from '../detail/lot-detail.component';
import { LotUpdateComponent } from '../update/lot-update.component';
import { LotRoutingResolveService } from './lot-routing-resolve.service';
import { Authority } from '../../../config/authority.constants';

const lotRoute: Routes = [
  {
    path: '',
    component: LotComponent,
    data: {
      defaultSort: 'id,asc',
      authorities: [Authority.ADMIN],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LotDetailComponent,
    data: {
      authorities: [Authority.IGNORE],
    },
    resolve: {
      lot: LotRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LotUpdateComponent,
    data: {
      authorities: [Authority.IGNORE],
    },
    resolve: {
      lot: LotRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LotUpdateComponent,
    data: {
      authorities: [Authority.IGNORE],
    },
    resolve: {
      lot: LotRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(lotRoute)],
  exports: [RouterModule],
})
export class LotRoutingModule {}
