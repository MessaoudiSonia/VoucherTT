import { Route } from '@angular/router';
import { Authority } from '../../config/authority.constants';

import { RegisterComponent } from './register.component';

export const registerRoute: Route = {
  path: 'register',
  component: RegisterComponent,
  data: {
    pageTitle: 'register.title',
    data: {
      authorities: [Authority.ADMIN],
    },
  },
};
