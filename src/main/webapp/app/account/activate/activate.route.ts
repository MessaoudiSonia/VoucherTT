import { Route } from '@angular/router';
import { Authority } from '../../config/authority.constants';

import { ActivateComponent } from './activate.component';

export const activateRoute: Route = {
  path: 'activate',
  component: ActivateComponent,
  data: {
    pageTitle: 'activate.title',
    data: {
      authorities: [Authority.ADMIN],
    },
  },
};
