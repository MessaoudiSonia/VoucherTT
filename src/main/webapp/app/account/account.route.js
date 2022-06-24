'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.accountState = void 0;
var activate_route_1 = require('./activate/activate.route');
var password_route_1 = require('./password/password.route');
var password_reset_finish_route_1 = require('./password-reset/finish/password-reset-finish.route');
var password_reset_init_route_1 = require('./password-reset/init/password-reset-init.route');
var register_route_1 = require('./register/register.route');
var settings_route_1 = require('./settings/settings.route');
var ACCOUNT_ROUTES = [
  activate_route_1.activateRoute,
  password_route_1.passwordRoute,
  password_reset_finish_route_1.passwordResetFinishRoute,
  password_reset_init_route_1.passwordResetInitRoute,
  register_route_1.registerRoute,
  settings_route_1.settingsRoute,
];
exports.accountState = [
  {
    path: '',
    children: ACCOUNT_ROUTES,
  },
];
//# sourceMappingURL=account.route.js.map
