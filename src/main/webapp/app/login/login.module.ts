import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { LOGIN_ROUTE } from './login.route';
import { LoginComponent } from './login.component';
import { NgxElectronModule } from 'ngx-electron';

@NgModule({
  imports: [SharedModule, NgxElectronModule, RouterModule.forChild([LOGIN_ROUTE])],
  declarations: [LoginComponent],
})
export class LoginModule {}
