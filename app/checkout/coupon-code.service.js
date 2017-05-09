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
var CouponCodeService = (function () {
    function CouponCodeService(_http) {
        this._http = _http;
        this.host_name = '';
        this._saveCouponCodeURL = this.host_name + '/StoreApi/Checkout/SaveCoupon';
        this._deleteCouponCodeURL = this.host_name + '/StoreApi/Checkout/DeleteCoupon';
        this.host_name = getHostName();
    }
    CouponCodeService.prototype.saveCouponCode = function (data) {
        var body = JSON.stringify(data);
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._saveCouponCodeURL, body, {
            headers: headers
        }).map(function (response) { return response.json(); });
    };
    CouponCodeService.prototype.deleteCouponCode = function () {
        return this._http.get(this._deleteCouponCodeURL)
            .map(function (response) { return response.json(); });
    };
    CouponCodeService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], CouponCodeService);
    return CouponCodeService;
}());
exports.CouponCodeService = CouponCodeService;
function getHostName() {
    var base_url = window.location.origin;
    return base_url;
}
//# sourceMappingURL=coupon-code.service.js.map