"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var core_1 = require('@angular/core');
var app_component_1 = require('./app.component');
var http_1 = require("@angular/http");
core_1.enableProdMode();
platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [http_1.HTTP_PROVIDERS, http_1.JSONP_PROVIDERS]);
//# sourceMappingURL=main.js.map