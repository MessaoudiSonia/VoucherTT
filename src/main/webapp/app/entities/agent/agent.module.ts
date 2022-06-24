import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { AgentComponent } from './list/agent.component';
import { AgentDetailComponent } from './detail/agent-detail.component';
import { AgentUpdateComponent } from './update/agent-update.component';
import { AgentDeleteDialogComponent } from './delete/agent-delete-dialog.component';
import { AgentRoutingModule } from './route/agent-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [SharedModule, AgentRoutingModule, Ng2SearchPipeModule, NgxPaginationModule],
  declarations: [AgentComponent, AgentDetailComponent, AgentUpdateComponent, AgentDeleteDialogComponent],
  entryComponents: [AgentDeleteDialogComponent],
})
export class AgentModule {}
