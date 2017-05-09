import {Injectable} from "@angular/core";
import {Customer} from "./customer";
import {Http, Headers} from "@angular/http";
import 'rxjs/Rx';

@Injectable()
export class AuthService {
    constructor (private _http: Http) {
        this.host_name = getHostName();
    }
    host_name: string = '';
    private _getCurrentTokenUrl = this.host_name+'/StoreApi/Account/CurrentToken';
    private _returnGetTokenUrl = this.host_name+'/StoreApi/Token';
    private _newGetTokenUrl = this.host_name+'/StoreApi/Account/Register';
    private _guestGetTokenUrl = this.host_name+'/StoreApi/Account/GuestLogin';
    private _userLogoutUrl = this.host_name+'/Store/Account/Logout';
    private _getUserDetailsUrl = this.host_name+'/StoreApi/Account/Details';

    getCurrentToken(){
        let headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        return this._http.get(this._getCurrentTokenUrl, {
            headers : headers
        }).map(res => res.json());
    }
    getUserDetails(token: any){
        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + token);
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        return this._http.get(this._getUserDetailsUrl, {
            headers : headers
        }).map(res => res.json());
    }

    signinGetToken(customer: Customer){
        var encode_email = encodeURIComponent(customer.email);
        var encode_password = encodeURIComponent(customer.password);
        const body = 'grant_type=password&username='+encode_email+'&password='+encode_password;
        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        return this._http.post(this._returnGetTokenUrl, body, {
            headers: headers
        }).map(response => response.json());
    }
    logout(){
        let headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        return this._http.get(this._userLogoutUrl, {
            headers : headers
        }).map(res => res);
    }
    registerGetToken(data: any){
        const body = JSON.stringify(data);
        const headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._newGetTokenUrl, body, {
            headers: headers
        }).map(response => response.json());
    }
    guestGetToken(data: any){
        const body = JSON.stringify(data);
        const headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._guestGetTokenUrl, body, {
            headers: headers
        }).map(response => response.json());
    }
}
function getHostName(){
    var base_url = window.location.origin;
    return base_url;
}