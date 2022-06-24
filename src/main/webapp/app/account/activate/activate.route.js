'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.activateRoute = void 0;
var authority_constants_1 = require('../../config/authority.constants');
var activate_component_1 = require('./activate.component');
exports.activateRoute = {
  path: 'activate',
  component: activate_component_1.ActivateComponent,
  data: {
    pageTitle: 'activate.title',
    data: {
      authorities: [authority_constants_1.Authority.ADMIN],
    },
  },
};
//# sourceMappingURL=activate.route.js.map
