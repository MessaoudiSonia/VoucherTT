import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PasswordComponent } from './password.component';
import { Authority } from 'app/config/authority.constants';

export const passwordRoute: Route = {
  path: 'password',
  component: PasswordComponent,
  data: {
    pageTitle: 'global.menu.account.password',
    authorities: [Authority.POSTE, Authority.ADMIN, Authority.USER, Authority.DISTRIBUTEUR],
  },
  canActivate: [UserRouteAccessService],
};
