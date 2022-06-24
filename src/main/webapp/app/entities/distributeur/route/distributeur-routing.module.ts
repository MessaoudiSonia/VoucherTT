import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DistributeurComponent } from '../list/distributeur.component';
import { DistributeurDetailComponent } from '../detail/distributeur-detail.component';
import { DistributeurUpdateComponent } from '../update/distributeur-update.component';
import { DistributeurRoutingResolveService } from './distributeur-routing-resolve.service';
import { Authority } from '../../../config/authority.constants';

const distributeurRoute: Routes = [
  {
    path: '',
    component: DistributeurComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.ADMIN, Authority.USER],
    },
  },
  {
    path: ':id/view',
    component: DistributeurDetailComponent,
    resolve: {
      distributeur: DistributeurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.ADMIN, Authority.USER],
    },
  },
  {
    path: 'new',
    component: DistributeurUpdateComponent,
    resolve: {
      distributeur: DistributeurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.ADMIN, Authority.USER],
    },
  },
  {
    path: ':id/edit',
    component: DistributeurUpdateComponent,
    resolve: {
      distributeur: DistributeurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.ADMIN, Authority.USER],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(distributeurRoute)],
  exports: [RouterModule],
})
export class DistributeurRoutingModule {}
