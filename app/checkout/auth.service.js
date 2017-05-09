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
var AuthService = (function () {
    function AuthService(_http) {
        this._http = _http;
        this.host_name = '';
        this._getCurrentTokenUrl = this.host_name + '/StoreApi/Account/CurrentToken';
        this._returnGetTokenUrl = this.host_name + '/StoreApi/Token';
        this._newGetTokenUrl = this.host_name + '/StoreApi/Account/Register';
        this._guestGetTokenUrl = this.host_name + '/StoreApi/Account/GuestLogin';
        this._userLogoutUrl = this.host_name + '/Store/Account/Logout';
        this._getUserDetailsUrl = this.host_name + '/StoreApi/Account/Details';
        this.host_name = getHostName();
    }
    AuthService.prototype.getCurrentToken = function () {
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        return this._http.get(this._getCurrentTokenUrl, {
            headers: headers
        }).map(function (res) { return res.json(); });
    };
    AuthService.prototype.getUserDetails = function (token) {
        var headers = new http_1.Headers();
        headers.append('Authorization', 'Bearer ' + token);
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        return this._http.get(this._getUserDetailsUrl, {
            headers: headers
        }).map(function (res) { return res.json(); });
    };
    AuthService.prototype.signinGetToken = function (customer) {
        var encode_email = encodeURIComponent(customer.email);
        var encode_password = encodeURIComponent(customer.password);
        var body = 'grant_type=password&username=' + encode_email + '&password=' + encode_password;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        return this._http.post(this._returnGetTokenUrl, body, {
            headers: headers
        }).map(function (response) { return response.json(); });
    };
    AuthService.prototype.logout = function () {
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        return this._http.get(this._userLogoutUrl, {
            headers: headers
        }).map(function (res) { return res; });
    };
    AuthService.prototype.registerGetToken = function (data) {
        var body = JSON.stringify(data);
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._newGetTokenUrl, body, {
            headers: headers
        }).map(function (response) { return response.json(); });
    };
    AuthService.prototype.guestGetToken = function (data) {
        var body = JSON.stringify(data);
        var headers = new http_1.Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._guestGetTokenUrl, body, {
            headers: headers
        }).map(function (response) { return response.json(); });
    };
    AuthService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
function getHostName() {
    var base_url = window.location.origin;
    return base_url;
}
//# sourceMappingURL=auth.service.js.map