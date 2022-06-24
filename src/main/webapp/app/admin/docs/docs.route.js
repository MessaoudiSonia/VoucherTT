'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.docsRoute = void 0;
var authority_constants_1 = require('../../config/authority.constants');
var docs_component_1 = require('./docs.component');
exports.docsRoute = {
  path: '',
  component: docs_component_1.DocsComponent,
  data: {
    pageTitle: 'global.menu.admin.apidocs',
    authorities: [authority_constants_1.Authority.ADMIN],
  },
};
//# sourceMappingURL=docs.route.js.map
