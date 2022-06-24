import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoriqueComponent } from 'app/layouts/print/historique/historique.component';
import { ImpressionComponent } from 'app/layouts/print/impression/impression.component';
import { ReimpressionComponent } from 'app/layouts/print/reimpression/reimpression.component';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TemplateTtComponent } from 'app/layouts/print/template-tt/template-tt.component';
import { FragmentComponent } from 'app/entities/fichier/fragment/fragment.component';
import { AgentUpdateComponent } from 'app/entities/agent/update/agent-update.component';
import { AgentRoutingResolveService } from 'app/entities/agent/route/agent-routing-resolve.service';

const printRoutes: Routes = [
  {
    path: 'historique',
    component: HistoriqueComponent,
    data: {
      authorities: [Authority.USER, Authority.POSTE],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'impression',
    component: ImpressionComponent,
    data: {
      authorities: [Authority.POSTE],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'reimpression',
    component: ReimpressionComponent,
    data: {
      authorities: [Authority.POSTE],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'templateTT',
    component: TemplateTtComponent,
    data: {
      authorities: [Authority.USER, Authority.POSTE],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'fragment',
    component: FragmentComponent,
    data: {
      authorities: [Authority.USER, Authority.POSTE],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(printRoutes)],
  exports: [RouterModule],
})
export class PrintModuleRoutingModule {}
