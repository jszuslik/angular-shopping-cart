"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require('rxjs/Rx');
var BillingAddressService = (function () {
    function BillingAddressService(_http) {
        this._http = _http;
        this.host_name = '';
        this._getBillingAddressUrl = this.host_name + '/StoreApi/Billing/Billing';
        this.host_name = getHostName();
    }
    BillingAddressService.prototype.getBillingAddress = function (token) {
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        headers.append('Authorization', 'Bearer ' + token);
        return this._http.get(this._getBillingAddressUrl, {
            headers: headers
        }).map(function (response) { return response.json(); });
    };
    BillingAddressService.prototype.editBillingAddress = function (data, token) {
        var body = JSON.stringify(data);
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        headers.append('Authorization', 'Bearer ' + token);
        return this._http.post(this._getBillingAddressUrl, body, {
            headers: headers
        }).map(function (response) { return response.json(); });
    };
    BillingAddressService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], BillingAddressService);
    return BillingAddressService;
}());
exports.BillingAddressService = BillingAddressService;
function getHostName() {
    return window.location.origin;
}
//# sourceMappingURL=billing-address.service.js.map