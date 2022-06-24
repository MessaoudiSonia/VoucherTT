import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { FichierComponent } from './list/fichier.component';
import { FichierDetailComponent } from './detail/fichier-detail.component';
import { FichierUpdateComponent } from './update/fichier-update.component';
import { FichierDeleteDialogComponent } from './delete/fichier-delete-dialog.component';
import { FichierRoutingModule } from './route/fichier-routing.module';
import { ConfirmPasswordComponent } from './confirm-password/confirm-password.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [SharedModule, FichierRoutingModule, Ng2SearchPipeModule, FormsModule, NgxPaginationModule],
  declarations: [FichierComponent, FichierDetailComponent, FichierUpdateComponent, FichierDeleteDialogComponent, ConfirmPasswordComponent],
  entryComponents: [FichierDeleteDialogComponent],
})
export class FichierModule {}
