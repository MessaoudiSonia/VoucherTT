import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { LotComponent } from './list/lot.component';
import { LotDetailComponent } from './detail/lot-detail.component';
import { LotUpdateComponent } from './update/lot-update.component';
import { LotDeleteDialogComponent } from './delete/lot-delete-dialog.component';
import { LotRoutingModule } from './route/lot-routing.module';

@NgModule({
  imports: [SharedModule, LotRoutingModule],
  declarations: [LotComponent, LotDetailComponent, LotUpdateComponent, LotDeleteDialogComponent],
  entryComponents: [LotDeleteDialogComponent],
})
export class LotModule {}
