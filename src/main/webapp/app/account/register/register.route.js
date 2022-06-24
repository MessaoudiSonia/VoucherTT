'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.registerRoute = void 0;
var authority_constants_1 = require('../../config/authority.constants');
var register_component_1 = require('./register.component');
exports.registerRoute = {
  path: 'register',
  component: register_component_1.RegisterComponent,
  data: {
    pageTitle: 'register.title',
    data: {
      authorities: [authority_constants_1.Authority.ADMIN],
    },
  },
};
//# sourceMappingURL=register.route.js.map
