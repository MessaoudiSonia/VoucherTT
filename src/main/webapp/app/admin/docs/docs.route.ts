import { Route } from '@angular/router';
import { Authority } from '../../config/authority.constants';

import { DocsComponent } from './docs.component';

export const docsRoute: Route = {
  path: '',
  component: DocsComponent,
  data: {
    pageTitle: 'global.menu.admin.apidocs',
    authorities: [Authority.ADMIN],
  },
};
