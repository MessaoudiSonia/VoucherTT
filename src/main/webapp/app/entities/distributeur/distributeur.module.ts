import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { DistributeurComponent } from './list/distributeur.component';
import { DistributeurDetailComponent } from './detail/distributeur-detail.component';
import { DistributeurUpdateComponent } from './update/distributeur-update.component';
import { DistributeurDeleteDialogComponent } from './delete/distributeur-delete-dialog.component';
import { DistributeurRoutingModule } from './route/distributeur-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [SharedModule, DistributeurRoutingModule, Ng2SearchPipeModule, NgxPaginationModule],
  declarations: [DistributeurComponent, DistributeurDetailComponent, DistributeurUpdateComponent, DistributeurDeleteDialogComponent],
  entryComponents: [DistributeurDeleteDialogComponent],
})
export class DistributeurModule {}
