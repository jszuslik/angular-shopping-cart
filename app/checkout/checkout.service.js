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
require('rxjs/add/operator/map');
var http_1 = require("@angular/http");
var http_2 = require('@angular/http');
var CheckoutService = (function () {
    function CheckoutService(_http, jsonp) {
        this._http = _http;
        this.jsonp = jsonp;
        this.host_name = '';
        this._shoppingCheckoutStateUrl = this.host_name + '/StoreApi/Checkout/Checkout';
        this._removeCartItemUrl = this.host_name + '/StoreApi/Checkout/RemoveItem';
        this._updateCartItemQtyUrl = this.host_name + '/StoreApi/Checkout/UpdateItemQty';
        this._resetOptionsUrl = this.host_name + '/StoreApi/Checkout/ResetCheckout';
        this._clearCartUrl = this.host_name + '/StoreApi/Checkout/ClearCart';
        this._recordOrderUrl = this.host_name + '/StoreApi/Checkout/RecordOrder';
        this._submitStripeOrderUrl = this.host_name + '/StoreApi/Checkout/RecordOrder';
        this._submitTermsOrderUrl = this.host_name + '/StoreApi/Checkout/RecordOrder';
        this._submitContactOrderUrl = this.host_name + '/StoreApi/Checkout/RecordOrder';
        this._setTaxExemptOnItemUrl = this.host_name + '/StoreApi/Checkout/SetTaxExempt';
        this.host_name = getHostName();
    }
    CheckoutService.prototype.getShoppingCart = function () {
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        return this._http.get(this._shoppingCheckoutStateUrl, {
            headers: headers
        }).map(function (res) { return res.json(); });
    };
    CheckoutService.prototype.removeCartItem = function (data) {
        var body = JSON.stringify(data);
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._removeCartItemUrl, body, {
            headers: headers
        }).map(function (response) { return response.json(); });
    };
    CheckoutService.prototype.updateCartItemQty = function (data) {
        var body = JSON.stringify(data);
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._updateCartItemQtyUrl, body, {
            headers: headers
        }).map(function (response) { return response.json(); });
    };
    CheckoutService.prototype.resetOptions = function () {
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        return this._http.get(this._resetOptionsUrl, {
            headers: headers
        }).map(function (res) { return res.json(); });
    };
    CheckoutService.prototype.clearCart = function () {
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        return this._http.get(this._clearCartUrl, {
            headers: headers
        }).map(function (res) { return res.json(); });
    };
    CheckoutService.prototype.recordOrder = function (data, token) {
        var body = JSON.stringify(data);
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        headers.append('Authorization', 'Bearer ' + token);
        return this._http.post(this._recordOrderUrl, body, {
            headers: headers
        }).map(function (response) { return response.json(); });
    };
    CheckoutService.prototype.submitStripeOrder = function (data) {
        var body = JSON.stringify(data);
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._submitStripeOrderUrl, body, {
            headers: headers
        }).map(function (response) { return response.json(); });
    };
    CheckoutService.prototype.submitTermsOrder = function (data) {
        var body = JSON.stringify(data);
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._submitTermsOrderUrl, body, {
            headers: headers
        }).map(function (response) { return response.json(); });
    };
    CheckoutService.prototype.submitContactOrder = function (data) {
        var body = JSON.stringify(data);
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._submitContactOrderUrl, body, {
            headers: headers
        }).map(function (response) { return response.json(); });
    };
    CheckoutService.prototype.setTaxExemptOnItem = function (data) {
        var body = JSON.stringify(data);
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._setTaxExemptOnItemUrl, body, {
            headers: headers
        }).map(function (response) { return response.json(); });
    };
    CheckoutService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, http_2.Jsonp])
    ], CheckoutService);
    return CheckoutService;
}());
exports.CheckoutService = CheckoutService;
function getHostName() {
    var base_url = window.location.origin;
    return base_url;
}
//# sourceMappingURL=checkout.service.js.map