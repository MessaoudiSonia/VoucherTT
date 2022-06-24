import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PosteComponent } from '../list/poste.component';
import { PosteDetailComponent } from '../detail/poste-detail.component';
import { PosteUpdateComponent } from '../update/poste-update.component';
import { PosteRoutingResolveService } from './poste-routing-resolve.service';
import { Authority } from '../../../config/authority.constants';

const posteRoute: Routes = [
  {
    path: '',
    component: PosteComponent,
    data: {
      defaultSort: 'id,asc',
      authorities: [Authority.ADMIN, Authority.USER, Authority.DISTRIBUTEUR],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PosteDetailComponent,
    resolve: {
      poste: PosteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.ADMIN, Authority.USER, Authority.DISTRIBUTEUR],
    },
  },
  {
    path: 'new',
    component: PosteUpdateComponent,
    resolve: {
      poste: PosteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.ADMIN, Authority.USER],
    },
  },
  {
    path: ':id/edit',
    component: PosteUpdateComponent,
    resolve: {
      poste: PosteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.IGNORE],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(posteRoute)],
  exports: [RouterModule],
})
export class PosteRoutingModule {}
