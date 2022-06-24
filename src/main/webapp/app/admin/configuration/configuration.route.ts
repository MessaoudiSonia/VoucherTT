import { Route } from '@angular/router';
import { Authority } from '../../config/authority.constants';

import { ConfigurationComponent } from './configuration.component';

export const configurationRoute: Route = {
  path: '',
  component: ConfigurationComponent,
  data: {
    pageTitle: 'configuration.title',
    authorities: [Authority.ADMIN],
  },
};
