import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FichierComponent } from '../list/fichier.component';
import { FichierDetailComponent } from '../detail/fichier-detail.component';
import { FichierUpdateComponent } from '../update/fichier-update.component';
import { FichierRoutingResolveService } from './fichier-routing-resolve.service';
import { Authority } from '../../../config/authority.constants';
import { FragmentComponent } from 'app/entities/fichier/fragment/fragment.component';

const fichierRoute: Routes = [
  {
    path: '',
    component: FichierComponent,
    data: {
      defaultSort: 'id,asc',
      authorities: [Authority.USER, Authority.POSTE, Authority.DISTRIBUTEUR],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FichierDetailComponent,
    resolve: {
      fichier: FichierRoutingResolveService,
    },
    data: {
      authorities: [Authority.USER],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FichierUpdateComponent,
    resolve: {
      fichier: FichierRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.ADMIN],
    },
  },
  {
    path: ':id/edit',
    component: FichierUpdateComponent,
    resolve: {
      fichier: FichierRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.ADMIN],
    },
  },
  {
    path: 'fragment/:id',
    component: FragmentComponent,
    data: {
      authorities: [Authority.USER, Authority.POSTE],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(fichierRoute)],
  exports: [RouterModule],
})
export class FichierRoutingModule {}
