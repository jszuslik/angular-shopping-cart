import { Injectable } from "@angular/core";
import 'rxjs/add/operator/map';
import { Http, Headers } from "@angular/http";
import { Jsonp } from '@angular/http';

@Injectable()
export class CheckoutService {
    constructor (private _http: Http, private jsonp:Jsonp) {
        this.host_name = getHostName();
    }
    host_name: string = '';
    private _shoppingCheckoutStateUrl = this.host_name+'/StoreApi/Checkout/Checkout';
    private _removeCartItemUrl = this.host_name+'/StoreApi/Checkout/RemoveItem';
    private _updateCartItemQtyUrl = this.host_name+'/StoreApi/Checkout/UpdateItemQty';
    private _resetOptionsUrl = this.host_name+'/StoreApi/Checkout/ResetCheckout';
    private _clearCartUrl = this.host_name+'/StoreApi/Checkout/ClearCart';
    private _recordOrderUrl = this.host_name+'/StoreApi/Checkout/RecordOrder';
    private _submitStripeOrderUrl = this.host_name+'/StoreApi/Checkout/RecordOrder';
    private _submitTermsOrderUrl = this.host_name+'/StoreApi/Checkout/RecordOrder';
    private _submitContactOrderUrl = this.host_name+'/StoreApi/Checkout/RecordOrder';
    private _setTaxExemptOnItemUrl = this.host_name+'/StoreApi/Checkout/SetTaxExempt';

    getShoppingCart(){
        let headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        return this._http.get(this._shoppingCheckoutStateUrl, {
            headers : headers
        }).map(res => res.json());
    }

    removeCartItem(data: any){
        const body = JSON.stringify(data);
        const headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._removeCartItemUrl, body, {
            headers: headers
        }).map(response => response.json());
    }
    updateCartItemQty(data: any){
        const body = JSON.stringify(data);
        const headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._updateCartItemQtyUrl, body, {
            headers: headers
        }).map(response => response.json());
    }
    resetOptions(){
        let headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        return this._http.get(this._resetOptionsUrl, {
            headers : headers
        }).map(res => res.json());
    }
    clearCart(){
        let headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        return this._http.get(this._clearCartUrl, {
            headers : headers
        }).map(res => res.json());
    }
    recordOrder(data: any, token: any){
        const body = JSON.stringify(data);
        const headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        headers.append('Authorization', 'Bearer ' + token);
        return this._http.post(this._recordOrderUrl, body, {
            headers: headers
        }).map(response => response.json());
    }
    submitStripeOrder(data: any){
        const body = JSON.stringify(data);
        const headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._submitStripeOrderUrl, body, {
            headers: headers
        }).map(response => response.json());
    }
    submitTermsOrder(data: any){
        const body = JSON.stringify(data);
        const headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._submitTermsOrderUrl, body, {
            headers: headers
        }).map(response => response.json());
    }
    submitContactOrder(data: any){
        const body = JSON.stringify(data);
        const headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._submitContactOrderUrl, body, {
            headers: headers
        }).map(response => response.json());
    }
    setTaxExemptOnItem(data: any){
        const body = JSON.stringify(data);
        const headers = new Headers();
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this._http.post(this._setTaxExemptOnItemUrl, body, {
            headers: headers
        }).map(response => response.json());
    }
}
function getHostName(){
    var base_url = window.location.origin;
    return base_url;
}