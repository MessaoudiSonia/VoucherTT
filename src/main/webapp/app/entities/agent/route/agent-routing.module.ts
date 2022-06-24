import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AgentComponent } from '../list/agent.component';
import { AgentDetailComponent } from '../detail/agent-detail.component';
import { AgentUpdateComponent } from '../update/agent-update.component';
import { AgentRoutingResolveService } from './agent-routing-resolve.service';
import { Authority } from '../../../config/authority.constants';

const agentRoute: Routes = [
  {
    path: '',
    component: AgentComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.ADMIN],
    },
  },
  {
    path: ':id/view',
    component: AgentDetailComponent,
    resolve: {
      agent: AgentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.ADMIN],
    },
  },
  {
    path: 'new',
    component: AgentUpdateComponent,
    resolve: {
      agent: AgentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.ADMIN],
    },
  },
  {
    path: ':id/edit',
    component: AgentUpdateComponent,
    resolve: {
      agent: AgentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.ADMIN],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(agentRoute)],
  exports: [RouterModule],
})
export class AgentRoutingModule {}
