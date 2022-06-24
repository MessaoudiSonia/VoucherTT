import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DocumentComponent } from '../list/document.component';
import { DocumentDetailComponent } from '../detail/document-detail.component';
import { DocumentUpdateComponent } from '../update/document-update.component';
import { DocumentRoutingResolveService } from './document-routing-resolve.service';
import { Authority } from 'app/config/authority.constants';

const documentRoute: Routes = [
  {
    path: '',
    component: DocumentComponent,
    data: {
      defaultSort: 'id,asc',
      authorities: [Authority.ADMIN, Authority.USER, Authority.DISTRIBUTEUR],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DocumentDetailComponent,
    resolve: {
      document: DocumentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DocumentUpdateComponent,
    resolve: {
      document: DocumentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DocumentUpdateComponent,
    resolve: {
      document: DocumentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(documentRoute)],
  exports: [RouterModule],
})
export class DocumentRoutingModule {}
