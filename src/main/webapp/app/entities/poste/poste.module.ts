import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { PosteComponent } from './list/poste.component';
import { PosteDetailComponent } from './detail/poste-detail.component';
import { PosteUpdateComponent } from './update/poste-update.component';
import { PosteDeleteDialogComponent } from './delete/poste-delete-dialog.component';
import { PosteRoutingModule } from './route/poste-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [SharedModule, PosteRoutingModule, Ng2SearchPipeModule, NgxPaginationModule],
  declarations: [PosteComponent, PosteDetailComponent, PosteUpdateComponent, PosteDeleteDialogComponent],
  entryComponents: [PosteDeleteDialogComponent],
})
export class PosteModule {}
