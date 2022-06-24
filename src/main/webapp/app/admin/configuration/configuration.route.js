'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.configurationRoute = void 0;
var authority_constants_1 = require('../../config/authority.constants');
var configuration_component_1 = require('./configuration.component');
exports.configurationRoute = {
  path: '',
  component: configuration_component_1.ConfigurationComponent,
  data: {
    pageTitle: 'configuration.title',
    authorities: [authority_constants_1.Authority.ADMIN],
  },
};
//# sourceMappingURL=configuration.route.js.map
