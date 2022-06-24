import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PrintModuleRoutingModule } from './print-module-routing.module';
import { HistoriqueComponent } from 'app/layouts/print/historique/historique.component';
import { ImpressionComponent } from 'app/layouts/print/impression/impression.component';
import { ReimpressionComponent } from 'app/layouts/print/reimpression/reimpression.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'app/shared/shared.module';
import { ReimpressionConfirmComponent } from './reimpression-confirm/reimpression-confirm.component';
import { TemplateTtComponent } from './template-tt/template-tt.component';
import { NgxCSVtoJSONModule } from 'ngx-csvto-json';
import { NgxElectronModule } from 'ngx-electron';
import { ElectronService } from 'ngx-electron';
import { NgxPaginationModule } from 'ngx-pagination';
import { FragmentComponent } from '../../entities/fichier/fragment/fragment.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  declarations: [
    HistoriqueComponent,
    ImpressionComponent,
    ReimpressionComponent,
    ReimpressionConfirmComponent,
    TemplateTtComponent,
    FragmentComponent,
  ],
  imports: [
    PrintModuleRoutingModule,
    CommonModule,
    HttpClientModule,
    SharedModule,
    NgxCSVtoJSONModule,
    NgxElectronModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
  ],
  providers: [DatePipe, ElectronService],
})
export class PrintModuleModule {}
