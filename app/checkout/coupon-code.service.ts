import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import 'rxjs/Rx';

@Injectable()
export class CouponCodeService {
    constructor(private _http: Http){
        this.host_name = getHostName()
    }
    host_name: string = '';
    private _saveCouponCodeURL = this.host_name+'/StoreApi/Checkout/SaveCoupon';
    private _deleteCouponCodeURL = this.host_name+'/StoreApi/Checkout/DeleteCoupon';

    saveCouponCode(data: any){
        const body = JSON.stringify(data);
        const headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._saveCouponCodeURL, body, {
            headers: headers
        }).map(response => response.json());
    }
    deleteCouponCode(){
        return this._http.get(this._deleteCouponCodeURL)
            .map(response => response.json());
    }
}
function getHostName(){
    var base_url = window.location.origin;
    return base_url;
}