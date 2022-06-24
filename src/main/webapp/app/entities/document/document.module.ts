import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { DocumentComponent } from './list/document.component';
import { DocumentDetailComponent } from './detail/document-detail.component';
import { DocumentUpdateComponent } from './update/document-update.component';
import { DocumentDeleteDialogComponent } from './delete/document-delete-dialog.component';
import { DocumentRoutingModule } from './route/document-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [SharedModule, DocumentRoutingModule, Ng2SearchPipeModule, NgxPaginationModule],
  declarations: [DocumentComponent, DocumentDetailComponent, DocumentUpdateComponent, DocumentDeleteDialogComponent],
  entryComponents: [DocumentDeleteDialogComponent],
})
export class DocumentModule {}
