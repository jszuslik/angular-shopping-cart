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
var ShippingAddressService = (function () {
    function ShippingAddressService(_http) {
        this._http = _http;
        this.host_name = '';
        this._getShippingAddressUrl = this.host_name + '/StoreApi/Shipping/Shipping';
        this._getShippingOptionsURL = this.host_name + '/StoreApi/Checkout/LoadShippingOption';
        this._setShippingOptionsURL = this.host_name + '/StoreApi/Checkout/SetShippingOption';
        this._setBillToOptionUrl = this.host_name + '/StoreApi/Checkout/SetBillToOption';
        this.host_name = getHostName();
    }
    ShippingAddressService.prototype.getShippingAddress = function (token) {
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        headers.append('Authorization', 'Bearer ' + token);
        return this._http.get(this._getShippingAddressUrl, {
            headers: headers
        }).map(function (response) { return response.json(); });
    };
    ShippingAddressService.prototype.editShippingAddress = function (data, token) {
        var body = JSON.stringify(data);
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        headers.append('Authorization', 'Bearer ' + token);
        return this._http.post(this._getShippingAddressUrl, body, {
            headers: headers
        }).map(function (response) { return response.json(); });
    };
    ShippingAddressService.prototype.addShippingAddress = function (data, token) {
        var body = JSON.stringify(data);
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        headers.append('Authorization', 'Bearer ' + token);
        return this._http.post(this._getShippingAddressUrl, body, {
            headers: headers
        }).map(function (response) { return response.json(); });
    };
    ShippingAddressService.prototype.getShippingOptions = function (address) {
        var body = JSON.stringify(address);
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._getShippingOptionsURL, body, {
            headers: headers
        }).map(function (response) { return response.json(); });
    };
    ShippingAddressService.prototype.setShippingOption = function (row) {
        var body = JSON.stringify(row);
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._setShippingOptionsURL, body, {
            headers: headers
        }).map(function (response) { return response.json(); });
    };
    ShippingAddressService.prototype.setBillToOption = function (data) {
        var body = JSON.stringify(data);
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._setBillToOptionUrl, body, {
            headers: headers
        }).map(function (response) { return response.json(); });
    };
    ShippingAddressService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ShippingAddressService);
    return ShippingAddressService;
}());
exports.ShippingAddressService = ShippingAddressService;
function getHostName() {
    var base_url = window.location.origin;
    return base_url;
}
//# sourceMappingURL=shipping-address.service.js.map