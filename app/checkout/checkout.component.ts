import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {Checkout} from "./checkout";
import {CheckoutService} from "./checkout.service";
import {AuthService} from "./auth.service";
import {ControlGroup, FormBuilder, Validators, Control} from "@angular/common";
import {ShippingAddress} from "./shipping-address";
import {ShippingAddressService} from "./shipping-address.service";
import {CouponCodeService} from "./coupon-code.service";
import {CouponCode} from "./coupon-code";
import {BillingAddress} from "./billing-address";
import {PhoneNumber} from "../pipes/phone-number.pipe";
import {BillingAddressService} from "./billing-address.service";
import {StripeService} from "./stripe.service";
declare var Stripe: any;

@Component({
    selector: 'checkout',
    templateUrl: '/cart/app/checkout/checkout.template.html',
    providers: [CheckoutService, AuthService, ShippingAddressService, CouponCodeService, BillingAddressService, StripeService],
    pipes: [PhoneNumber]
})
export class CheckoutComponent implements OnInit {

    publishable_key: string;

    is_debug_on: boolean = false;

    constructor(private _sc: CheckoutService, private _auth:AuthService, private _fb: FormBuilder, private _sa:ShippingAddressService, private _coupon:CouponCodeService, private ref: ChangeDetectorRef, private _ba: BillingAddressService, private _stripe: StripeService){
        if(this.is_debug_on){
            console.log('Debug mode is on. Change "is_debug_on" to false when in production');
        }
        this.publishable_key = getStripePubKey();
        this.onGetCheckout();
        this.onGetCurrentUserToken();

        Stripe.setPublishableKey(this.publishable_key);
        this.returnCustomerForm = this._fb.group({
            'email': ['', Validators.required],
            'password': ['', Validators.required]
        });
        this.newCustomerForm = this._fb.group({
            'Email': ['', Validators.required],
            'Password': ['', Validators.required],
            'ConfirmPassword': ['', Validators.required]
        });
        this.guestCustomerForm = this._fb.group({
            'Email': ['', Validators.required]
        });
        if(this.isReturnCustomerAuth()) {
            this.onGetShippingAddress(this.user_token);
            this.onGetBillingAddress(this.user_token);
        } else if (this.isGuestCustomerAuth()){
            this.user_token = sessionStorage.getItem('token');
            this.onGetShippingAddress(this.user_token);
            this.onGetBillingAddress(this.user_token);
        }
        this.addShipAddressForm = this._fb.group({
            'firstname': ['', Validators.compose([
                Validators.required,
                Validators.minLength(1)
            ])],
            'lastname': ['', Validators.compose([
                Validators.required,
                Validators.minLength(1)
            ])],
            'phone': ['', Validators.compose([
                Validators.required,
                Validators.minLength(1)
            ])],
            'phoneext': [''],
            'company': [''],
            'address_type': ['none'],
            'address1': ['', Validators.compose([
                Validators.required,
                Validators.minLength(1)
            ])],
            'address2': [''],
            'city': ['', Validators.compose([
                Validators.required,
                Validators.minLength(1)
            ])],
            'state': [''],
            'zip': ['', Validators.compose([
                Validators.required,
                Validators.minLength(1)
            ])]
        });
        this.stripeCCForm = this._fb.group({
            'card_number': [''],
            'card_cvc': [''],
            'card_exp_month': ['00'],
            'card_exp_year': ['00']
        });
        this.getExpYear();
    }
    ngOnInit(){

    }
    /************  Order Summary Panel  *******************/
    showModify: boolean = false;
    modify_state: string = 'Modify Cart';
    showSummary: boolean = true;

    onShowSummary(value){
        if(this.is_debug_on){
            console.log(value);
        }
        this.showSummary = !value;
    }

    checkout: Checkout = new Checkout;
    has_custom_product: boolean = false;
    has_customer_product_user: boolean = false;
    onGetCheckout(){
        this._sc.getShoppingCart()
            .subscribe(
                data => {
                    this.checkout = data;
                },
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.checkout);
                    }
                    this.has_custom_product = this.checkout.OrderSummary.HasCustomProducts;
                    this.has_customer_product_user = this.checkout.OrderSummary.HasCustomProductsUserEntered;
                }
            );
    }
    onClearCart(){
        this._sc.clearCart()
            .subscribe(
                data => {
                    this.checkout = data;
                },
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.checkout);
                    }
                    this.has_custom_product = this.checkout.OrderSummary.HasCustomProducts;
                    this.has_customer_product_user = this.checkout.OrderSummary.HasCustomProductsUserEntered;
                }
            );
    }
    onResetOptions(){
        this._sc.resetOptions()
            .subscribe(
                data => {
                    this.checkout = data;
                },
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.checkout);
                    }
                    this.has_custom_product = this.checkout.OrderSummary.HasCustomProducts;
                    this.has_customer_product_user = this.checkout.OrderSummary.HasCustomProductsUserEntered;
                }

            );
    }
    onModify(){
        if(!this.showModify){
            this.showModify = true;
            this.modify_state = "Save Cart";
        } else {
            this.showModify = false;
            this.modify_state = "Modify Cart";
        }
    }
    cart_item_id: any = {
        ItemId: ''
    }
    cart_item_qty: any = {
        ItemId: '',
        Qty: ''
    }
    onDeleteCartItem(id){
        var r = confirm("You are about to delete this item from the cart. Are you sure?");
        if( r ){
            this.cart_item_id.ItemId = id;
            this._sc.removeCartItem(this.cart_item_id)
                .subscribe(
                    data => {
                        this.checkout = data;
                    },
                    error => {
                        if(this.is_debug_on){
                            console.error(error);
                        }
                    },
                    () => {
                        if(this.is_debug_on){
                            console.log(this.checkout);
                        }
                        if(this.isReturnCustomerAuth()){
                            this.getShippingOptions(this.selected_shipping.address);
                        } else if(this.isGuestCustomerAuth()){
                            this.getShippingOptions(this.guestShippingAddress);
                        }
                        this.has_custom_product = this.checkout.OrderSummary.HasCustomProducts;
                        this.has_customer_product_user = this.checkout.OrderSummary.HasCustomProductsUserEntered;
                        this.selected_shipping_method = null;
                        this.ups_billing_method_string = null;
                        this.ups_number = null;
                        this.shipping_method_string = null;
                        this.fedex_billing_method_string = null;
                        this.fedex_number = null;
                    }
                );
        }
    }
    addItem(id, current_qty){
        let new_qty;
        if(this.is_debug_on){
            console.log(current_qty);
        }
        new_qty = current_qty + 1;
        if(this.is_debug_on){
            console.log(new_qty);
        }
        this.onUpdateCartItemQty(id, new_qty);
    }
    current_item_qty: number;
    setCurrentQty(idx){
        this.current_item_qty = this.checkout.OrderSummary.Cart_Items[idx].Qty;
        if(this.is_debug_on){
            console.log(this.current_item_qty);
        }
    }
    inputUpdateCart(idx, id, qty){
        if(qty <= 0){
            var r = confirm("You are about change the Qty of this item to Zero. This will remove the item from the cart.");
            if( r ){
                this.onUpdateCartItemQty(id, qty);
            } else {
                this.onUpdateCartItemQty(id, this.current_item_qty);
            }
        } else {
            this.onUpdateCartItemQty(id, qty);
        }

    }
    removeItem(id, current_qty){
        if(current_qty > 1){
            let new_qty;
            if(this.is_debug_on){
                console.log(current_qty);
            }
            new_qty = current_qty - 1;
            if(this.is_debug_on){
                console.log(new_qty);
            }
            this.onUpdateCartItemQty(id, new_qty);
        } else {
            var r = confirm("You are about change the Qty of this item to Zero. This will remove the item from the cart.");
            if( r ){
                let new_qty;
                if(this.is_debug_on){
                    console.log(current_qty);
                }
                new_qty = current_qty - 1;
                if(this.is_debug_on){
                    console.log(new_qty);
                }
                this.onUpdateCartItemQty(id, new_qty);
            }
        }
    }
    onUpdateCartItemQty(id, new_qty){
        this.cart_item_qty.ItemId = id;
        this.cart_item_qty.Qty = new_qty;
        this.selected_shipping_method = null;
        this.ups_billing_method_string = null;
        this.ups_number = null;
        this.shipping_method_string = null;
        this.fedex_billing_method_string = null;
        this.fedex_number = null;
        this._sc.updateCartItemQty(this.cart_item_qty)
            .subscribe(
                data => {
                    this.checkout = data;
                },
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.checkout);
                    }
                    if(this.isReturnCustomerAuth() && this.is_address_selected){
                        console.log(this.selected_shipping.address);
                        this.getShippingOptions(this.selected_shipping.address);
                    } else if(this.isGuestCustomerAuth()){
                        console.log(this.guestShippingAddress);
                        this.getShippingOptions(this.guestShippingAddress);
                    }
                    this.has_custom_product = this.checkout.OrderSummary.HasCustomProducts;
                    this.has_customer_product_user = this.checkout.OrderSummary.HasCustomProductsUserEntered;

                }
            );
    }
    setTaxExempt(itemid, is_tax_exempt){
        let taxExemptSubmit = {
            ItemId: itemid,
            IsTaxExempt: is_tax_exempt
        }
        if(this.is_debug_on) {
            console.log(taxExemptSubmit);
        }
        this._sc.setTaxExemptOnItem(taxExemptSubmit)
            .subscribe(
                data => {
                    this.checkout = data;
                },
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.checkout);
                    }
                    if(this.isReturnCustomerAuth() && this.is_address_selected){
                        console.log(this.selected_shipping.address);
                        this.getShippingOptions(this.selected_shipping.address);
                    } else if(this.isGuestCustomerAuth()){
                        console.log(this.guestShippingAddress);
                        this.getShippingOptions(this.guestShippingAddress);
                    }
                    this.has_custom_product = this.checkout.OrderSummary.HasCustomProducts;
                    this.has_customer_product_user = this.checkout.OrderSummary.HasCustomProductsUserEntered;
                    this.selected_shipping_method = null;
                    this.ups_billing_method_string = null;
                    this.ups_number = null;
                    this.shipping_method_string = null;
                    this.fedex_billing_method_string = null;
                    this.fedex_number = null;
                }
            );
    }

    /**********   Login Panel ************/

    showLoginPanel: boolean = true;
    hideLoginPanel: boolean = false;
    returnCustomerForm: ControlGroup;
    return_cust_email: string;
    user_token: string = localStorage.getItem('token');
    signin_error_obj: any;
    signin_error: string = '';
    access_token: any = {
        "access_token": '',
        "token_type": '',
        "expires_in": '',
        "userName": '',
        ".issued": '',
        ".expires": ''
    };
    toggleLoginPanel(newState){
        this.showLoginPanel = newState;
        this.hideLoginPanel = !newState;
        this.showShippingPanel = false;
        this.hideShippingPanel = true;
        this.showBillingPanel = false;
        this.hideBillingPanel = true;
    }

    onSignin(){
        if(this.isReturnCustomerAuth() || this.isGuestCustomerAuth()){
            this._auth.logout()
                .subscribe(
                    data => {
                        if(this.is_debug_on){
                            console.log(data);
                        }
                    },
                    error => {
                        if(this.is_debug_on){
                            console.error(error);
                        }
                    },
                    () => {
                        sessionStorage.removeItem('guest_email');
                        sessionStorage.removeItem('token');
                        sessionStorage.removeItem('expires');
                        localStorage.removeItem('email');
                        localStorage.removeItem('expires');
                        localStorage.removeItem('token');
                        logoutHeader();
                    }
                );
        }
        this._auth.signinGetToken(this.returnCustomerForm.value)
            .subscribe(
                data => {
                    this.access_token = data;
                },
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                    this.signin_error_obj = error.json();
                    this.signin_error = this.signin_error_obj.error_description;
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.access_token);
                    }
                    localStorage.setItem('token', this.access_token.access_token);
                    localStorage.setItem('expires', setExpiresToken(this.access_token.expires_in));
                    this.user_token = this.access_token.access_token;
                    localStorage.setItem('email', this.access_token.userName);
                    this.onGetShippingAddress(this.user_token);
                    this.onGetBillingAddress(this.user_token);
                    this.returnCustomerForm = this._fb.group({
                        'email': ['', Validators.required],
                        'password': ['', Validators.required]
                    });
                    this.signin_error = '';
                    this.guest_signin_error = '';
                    this.showLoginPanel = false;
                    this.hideLoginPanel = true;
                    this.showShippingPanel = true;
                    this.hideShippingPanel = false;
                    loginHeader();
                    this.getUserDetails();
                }
            );
    }
    is_user_current: boolean;
    onGetCurrentUserToken(){
        this._auth.getCurrentToken()
            .subscribe(
                data => {
                    this.access_token = data;
                },
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                    localStorage.removeItem('email');
                    localStorage.removeItem('token');
                    localStorage.removeItem('expires');
                    sessionStorage.removeItem('guest_email');
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('expires');
                    this.is_user_current = false;
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.access_token);
                    }
                    localStorage.setItem('token', this.access_token.access_token);
                    localStorage.setItem('email', this.access_token.userName);
                    localStorage.setItem('expires', setExpiresToken(this.access_token.expires_in));
                    this.user_token = this.access_token.access_token;
                    this.onGetShippingAddress(this.user_token);
                    this.onGetBillingAddress(this.user_token);
                    this.returnCustomerForm = this._fb.group({
                        'email': ['', Validators.required],
                        'password': ['', Validators.required]
                    });
                    this.signin_error = '';
                    this.guest_signin_error = '';
                    this.showLoginPanel = false;
                    this.hideLoginPanel = true;
                    this.showShippingPanel = true;
                    this.hideShippingPanel = false;
                    ifCurrentUserLogin();
                    this.is_user_current = true;
                    this.getUserDetails();
                }
            );
    }
    user_details_object: any = {
        IsCustomer: false,
        IsSubAccount: false,
        LoginId: '',
        CustomerId: null,
        Name: '',
        IsEmailConfirmed: false,
        AllowTaxExempt: false,
        EnableCustomerCatalog: false,
        EnableManualOrderEntry: false,
        EnableSubAccounts: true,
        Message: ''
    }
    getUserDetails(){
        this._auth.getUserDetails(this.user_token)
            .subscribe(
                data => {
                    this.user_details_object = data;
                },
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                    this.user_details_object = error;
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.user_details_object);
                    }
                    this.return_cust_email = this.user_details_object.Name;
                    welcomeHeader(this.user_details_object.Name);
                    this.showLoginPanel = false;
                    this.hideLoginPanel = true;
                    this.showShippingPanel = true;
                    this.hideShippingPanel = false;
                    ifCurrentUserLogin();
                }
            );
    }
    newCustomerForm: ControlGroup;
    new_confirm_message: any = {};
    new_signin_success: string;
    new_signin_error: string;
    new_signin_error_msg: string;
    new_signin_error_desc: string;
    new_signin_error_obj: any;
    new_signin_error_pw_obj: any;
    new_signin_error_pw: string;
    new_signin_error_cp: string;
    new_error_message: any = {
        Message: '',
        Error: '',
        Description: '',
        ModelState: {}
    };
    onRegister(){
        if(this.isReturnCustomerAuth() || this.isGuestCustomerAuth()){
            this._auth.logout()
                .subscribe(
                    data => {
                        if(this.is_debug_on){
                            console.log(data);
                        }
                    },
                    error => {
                        if(this.is_debug_on){
                            console.error(error);
                        }
                    },
                    () => {
                        sessionStorage.removeItem('guest_email');
                        sessionStorage.removeItem('token');
                        sessionStorage.removeItem('expires');
                        localStorage.removeItem('email');
                        localStorage.removeItem('expires');
                        localStorage.removeItem('token');
                        logoutHeader();
                    }
                );
        }
        this._auth.registerGetToken(this.newCustomerForm.value)
            .subscribe(
                data => {
                    this.access_token = data;
                },
                error => {
                    this.new_error_message = error.json();
                    if(this.is_debug_on){
                        console.error(this.new_error_message);
                    }
                    if(this.new_error_message.Error){
                        this.new_signin_error = this.new_error_message.Error;
                    } else {
                        this.new_signin_error = '';
                        this.new_signin_error_cp = '';
                        this.new_signin_error_pw = '';
                    }
                    if(this.new_error_message.Message){
                        this.new_signin_error_msg = this.new_error_message.Message;
                    } else {
                        this.new_signin_error_msg = '';
                        this.new_signin_error_cp = '';
                        this.new_signin_error_pw = '';
                    }
                    if(this.new_error_message.Description){
                        this.new_signin_error_desc = this.new_error_message.Description;
                    } else {
                        this.new_signin_error_desc = '';
                        this.new_signin_error_cp = '';
                        this.new_signin_error_pw = '';
                    }
                    this.new_signin_error_obj = JSON.stringify(this.new_error_message.ModelState);
                    if(this.new_signin_error_obj){
                        this.new_signin_error_pw_obj = JSON.parse(this.new_signin_error_obj.replace("model.", ""));
                        if("Password" in this.new_signin_error_pw_obj){
                            this.new_signin_error_pw = this.new_signin_error_pw_obj.Password;
                            this.new_signin_error_cp = '';
                        } else if("ConfirmPassword" in this.new_signin_error_pw_obj){
                            this.new_signin_error_cp = this.new_signin_error_pw_obj.ConfirmPassword;
                            this.new_signin_error_pw = '';
                        }
                    } else {
                        this.new_signin_error_cp = '';
                        this.new_signin_error_pw = '';
                    }
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.access_token);
                    }
                    // this.new_signin_success = this.new_confirm_message.Description;
                    this.new_signin_error = '';
                    this.new_signin_error_msg = '';
                    this.new_signin_error_desc = '';
                    this.new_signin_error_pw = '';
                    this.new_signin_error_cp = '';
                    this.newCustomerForm = this._fb.group({
                        'Email': ['', Validators.required],
                        'Password': ['', Validators.required],
                        'ConfirmPassword': ['', Validators.required]
                    });

                    localStorage.setItem('token', this.access_token.access_token);
                    localStorage.setItem('expires', setExpiresToken(this.access_token.expires_in));
                    this.user_token = this.access_token.access_token;
                    localStorage.setItem('email', this.access_token.userName);
                    this.onGetShippingAddress(this.user_token);
                    this.onGetBillingAddress(this.user_token);
                    this.signin_error = '';
                    this.guest_signin_error = '';
                    this.showLoginPanel = false;
                    this.hideLoginPanel = true;
                    this.showShippingPanel = true;
                    this.hideShippingPanel = false;
                    loginHeader();
                    this.getUserDetails();
                }
            );
    }

    guestCustomerForm: ControlGroup;
    guest_signin_error_obj: any;
    guest_signin_error: string;
    guest_cust_email: string = sessionStorage.getItem('guest_email');

    guestCheckout(){
        if(this.isReturnCustomerAuth() || this.isGuestCustomerAuth()){
            this._auth.logout()
                .subscribe(
                    data => {
                        if(this.is_debug_on){
                            console.log(data);
                        }
                    },
                    error => {
                        if(this.is_debug_on){
                            console.error(error);
                        }
                    },
                    () => {
                        sessionStorage.removeItem('guest_email');
                        sessionStorage.removeItem('token');
                        sessionStorage.removeItem('expires');
                        localStorage.removeItem('email');
                        localStorage.removeItem('expires');
                        localStorage.removeItem('token');
                        logoutHeader();
                    }
                );
        }
        this._auth.guestGetToken(this.guestCustomerForm.value)
            .subscribe(
                data => {
                    this.access_token = data;
                },
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                    this.guest_signin_error_obj = error.json();
                    this.guest_signin_error = this.guest_signin_error_obj.Description;
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.access_token);
                    }
                    sessionStorage.setItem('token', this.access_token.access_token);
                    sessionStorage.setItem('guest_email', this.access_token.userName);
                    sessionStorage.setItem('expires', setExpiresToken(this.access_token.expires_in));
                    this.guest_cust_email = this.guestCustomerForm.value.Email;
                    this.user_token = this.access_token.access_token;
                    this.onGetShippingAddress(this.user_token);
                    this.onGetBillingAddress(this.user_token);
                    this.guest_signin_error = '';
                    this.showLoginPanel = false;
                    this.hideLoginPanel = true;
                    this.showShippingPanel = true;
                    this.hideShippingPanel = false;
                    this.guestCustomerForm = this._fb.group({
                        'Email': ['', Validators.required]
                    });
                    this.getUserDetails();
                }
            );
    }
    userLogout(){
        var r = confirm("You are about to logout.");
        if (r == true){
            this._auth.logout()
                .subscribe(
                    data => {
                        if(this.is_debug_on){
                            console.log(data);
                        }
                    },
                    error => {
                        if(this.is_debug_on){
                            console.error(error);
                        }
                    },
                    () => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('email');
                        localStorage.removeItem('new_user');
                        localStorage.removeItem('expires');
                        sessionStorage.removeItem('guest_email');
                        sessionStorage.removeItem('token');
                        this.shipping_complete = false;
                        this.billing_complete = false;
                        this.review_complete = false;
                        logoutHeader();
                    }
                );
        }
    }
    sessionLogOut(){
        alert("You are being logged out due to a session timeout.");
        this._auth.logout()
            .subscribe(
                data => {
                    if(this.is_debug_on){
                        console.log(data);
                    }
                },
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                },
                () => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('email');
                    localStorage.removeItem('new_user');
                    localStorage.removeItem('expires');
                    sessionStorage.removeItem('guest_email');
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('expires');
                    this.shipping_complete = false;
                    this.billing_complete = false;
                    this.review_complete = false;
                    logoutHeader();
                }
            );
    }
    isReturnCustomerAuth(): boolean {
        if(localStorage.getItem('email') && localStorage.getItem('token')){
            return localStorage.getItem('token') !== null;
        }
    }
    isGuestCustomerAuth(): boolean {
        if(sessionStorage.getItem('guest_email') && sessionStorage.getItem('token')){
            return sessionStorage.getItem('token') !== null;
        }
    }
    isAuth(){
        if(this.isReturnCustomerAuth() || this.isGuestCustomerAuth()){
            return true;
        } else {
            return false;
        }
    }

    /**********   Shipping Panel ************/
    shipping_complete: boolean;
    ship_status: string;
    shipping_method_string: string;
    showShippingPanel: boolean = true;
    hideShippingPanel: boolean = false;
    show_add_address: boolean;
    shipping_address: any = {
        ShippingAddresses: []
    }
    selectShipAddress: ShippingAddress;
    edit_ship_address: boolean;
    states: Array<any> = [
        { key: '', value: 'Choose A State', disabled: true},
        { key: 'AL', value: 'Alabama'},
        { key: 'AK', value: 'Alaska'},
        { key: 'AZ', value: 'Arizona'},
        { key: 'AR', value: 'Arkansas'},
        { key: 'CA', value: 'California'},
        { key: 'CO', value: 'Colorado'},
        { key: 'CT', value: 'Connecticut'},
        { key: 'DE', value: 'Delaware'},
        { key: 'DC', value: 'District of Columbia'},
        { key: 'FL', value: 'Florida'},
        { key: 'GA', value: 'Georgia'},
        { key: 'HI', value: 'Hawaii'},
        { key: 'ID', value: 'Idaho'},
        { key: 'IL', value: 'Illinois'},
        { key: 'IN', value: 'Indiana'},
        { key: 'IA', value: 'Iowa'},
        { key: 'KS', value: 'Kansas'},
        { key: 'KY', value: 'Kentucky'},
        { key: 'LA', value: 'Louisiana'},
        { key: 'ME', value: 'Maine'},
        { key: 'MD', value: 'Maryland'},
        { key: 'MA', value: 'Massachusetts'},
        { key: 'MI', value: 'Michigan'},
        { key: 'MN', value: 'Minnesota'},
        { key: 'MS', value: 'Mississippi'},
        { key: 'MO', value: 'Missouri'},
        { key: 'MT', value: 'Montana'},
        { key: 'NE', value: 'Nebraska'},
        { key: 'NV', value: 'Nevada'},
        { key: 'NH', value: 'New Hampshire'},
        { key: 'NJ', value: 'New Jersey'},
        { key: 'NM', value: 'New Mexico'},
        { key: 'NY', value: 'New York'},
        { key: 'NC', value: 'North Carolina'},
        { key: 'ND', value: 'North Dakota'},
        { key: 'OH', value: 'Ohio'},
        { key: 'OK', value: 'Oklahoma'},
        { key: 'OR', value: 'Oregon'},
        { key: 'PA', value: 'Pennsylvania'},
        { key: 'RI', value: 'Rhode Island'},
        { key: 'SC', value: 'South Carolina'},
        { key: 'SD', value: 'South Dakota'},
        { key: 'TN', value: 'Tennessee'},
        { key: 'TX', value: 'Texas'},
        { key: 'UT', value: 'Utah'},
        { key: 'VT', value: 'Vermont'},
        { key: 'VA', value: 'Virginia'},
        { key: 'WA', value: 'Washington'},
        { key: 'WV', value: 'West Virginia'},
        { key: 'WI', value: 'Wisconsin'},
        { key: 'WY', value: 'Wyoming'},
        { key: 'provinces', value: 'Canadian Provinces', disabled: true},
        { key: 'AB', value: 'Alberta' },
        { key: 'BC', value: 'British Columbia' },
        { key: 'MB', value: 'Manitoba' },
        { key: 'NB', value: 'New Brunswick' },
        { key: 'NL', value: 'Newfoundland and Labrador' },
        { key: 'NS', value: 'Nova Scotia' },
        { key: 'ON', value: 'Ontario' },
        { key: 'PE', value: 'Prince Edward Island' },
        { key: 'QC', value: 'Quebec' },
        { key: 'SK', value: 'Saskatchewan' },
        { key: 'NT', value: 'Northwest Territories' },
        { key: 'NU', value: 'Nunavut' },
        { key: 'YT', value: 'Yukon'}
    ];
    addShipAddressForm: ControlGroup;
    selected_ship_address: any = {
        option: null
    };
    new_shipping_options: boolean;
    display_coupon_code: boolean;
    toggleShippingPanel(newState){
        this.showShippingPanel = newState;
        this.hideShippingPanel = !newState;
        this.showLoginPanel = false;
        this.hideLoginPanel = true;
        this.showBillingPanel = false;
        this.hideBillingPanel = true;
    }
    onGetShippingAddress(token){
        this._sa.getShippingAddress(token)
            .subscribe(
                data => this.shipping_address = data,
                error => {
                    console.error(error);
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.shipping_address);
                    }
                }
            );
    }
    is_address_selected: boolean = false;
    onChangeAddress(value, index){
        this.selected_shipping_method = null;
        this.ups_billing_method_string = null;
        this.ups_number = null;
        this.shipping_method_string = null;
        this.fedex_billing_method_string = null;
        this.fedex_number = null;
        this.is_address_selected = true;
        this.updateShipStatus(value, '');
        this.getShippingOptions(value);
        this.selected_shipping.address = value;
    }
    updateShipStatus(value, ship_status_string: string){
        ship_status_string = value.Address1;
        if(value.Address2 != null){
            ship_status_string += ', ' + value.Address2;
        }
        if(value.City.length > 0){
            ship_status_string += ', ' + value.City;
        }
        if(value.State.length > 0){
            ship_status_string += ', ' + value.State;
        }
        if(value.Zip.length > 0){
            ship_status_string += ', ' + value.Zip;
        }
        this.ship_status = ship_status_string;
    }
    selected_shipping: any = {
        address: {},
        index: null
    }
    onEditShip(address, index){
        this.edit_ship_address = true;
        this.selected_shipping.address = address;
        this.selected_ship_address.option = index;
        this.selected_shipping.index = index;
        this.show_add_address = false;
    }
    cancelEditShip(){
        this.edit_ship_address = false;
        this.getShippingOptions(this.selected_shipping.address);
    }
    shipping_form_error: any;
    guest_shipping_address: any = {
        ShippingAddresses: []
    }
    guestShippingAddress: any = {
        CustId: null,
        ShitToId: null,
        FName: '',
        LName: '',
        Phone: '',
        Phone_Ext: '',
        Company: '',
        Address1: '',
        Address2: '',
        City: '',
        State: '',
        Zip: ''
    };
    show_guest_address_form: boolean = true;
    show_guest_edit_address_form: boolean;
    onSaveGuestShipAddress(value){
        this.guestShippingAddress.CustId = 0;
        this.guestShippingAddress.ShipToId = 0;
        if(this.is_debug_on){
            console.log(this.guestShippingAddress);
        }
        this._sa.addShippingAddress(this.guestShippingAddress, this.user_token)
            .subscribe(
                data => {
                    this.guest_shipping_address = data;
                },
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                    this.shipping_form_error = error.json();
                    this.showShippingFormErrors(this.shipping_form_error.PropertyErrors);
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.guest_shipping_address);
                    }
                    this.getShippingOptions(this.guest_shipping_address.ShippingAddresses[0]);
                    this.guestShippingAddress = this.guest_shipping_address.ShippingAddresses[0];
                    this.show_guest_address_form = !value;
                    this.updateShipStatus(this.guest_shipping_address.ShippingAddresses[0], '');
                    this.shipping_form_errors.FName = false;
                    this.shipping_form_errors.LName = false;
                    this.shipping_form_errors.Address1 = false;
                    this.shipping_form_errors.City = false;
                    this.shipping_form_errors.State = false;
                    this.shipping_form_errors.Zip = false;
                }
            );
    }
    onEditGuestShip(value){
        this.show_guest_edit_address_form = !value;
    }
    onEditGuestShipAddress(value) {
        this._sa.editShippingAddress(this.guestShippingAddress, this.user_token)
            .subscribe(
                data => {
                    this.guest_shipping_address = data;
                },
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                    this.shipping_form_error = error.json();
                    this.showShippingFormErrors(this.shipping_form_error.PropertyErrors);
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.guest_shipping_address);
                    }
                    this.getShippingOptions(this.guest_shipping_address.ShippingAddresses[0]);
                    this.guestShippingAddress = this.guest_shipping_address.ShippingAddresses[0];
                    this.show_guest_edit_address_form = !value;
                    this.updateShipStatus(this.guest_shipping_address.ShippingAddresses[0], '');
                    this.shipping_form_errors.FName = false;
                    this.shipping_form_errors.LName = false;
                    this.shipping_form_errors.Address1 = false;
                    this.shipping_form_errors.City = false;
                    this.shipping_form_errors.State = false;
                    this.shipping_form_errors.Zip = false;
                }
            );
    }
    onSaveEditAddress(submitAddress: any){
        submitAddress = {
            ShipToId: this.selected_shipping.address.ShipToId,
            CustID: this.selected_shipping.address.CustId,
            FName: this.selected_shipping.address.FName,
            LName: this.selected_shipping.address.LName,
            Phone: this.selected_shipping.address.Phone,
            Phone_Ext: this.selected_shipping.address.Phone_Ext,
            Company: this.selected_shipping.address.Company,
            Address1: this.selected_shipping.address.Address1,
            Address2: this.selected_shipping.address.Address2,
            City: this.selected_shipping.address.City,
            State: this.selected_shipping.address.State,
            Zip: this.selected_shipping.address.Zip,
        };
        this._sa.editShippingAddress(submitAddress, this.user_token)
            .subscribe(
                data => this.shipping_address = data,
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                    this.shipping_form_error = error.json();
                    this.showShippingFormErrors(this.shipping_form_error.PropertyErrors);
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.shipping_address);
                    }
                    this.edit_ship_address = false;
                    this.selected_ship_address.option = this.selected_shipping.index;
                    this.updateShipStatus(this.selected_shipping.address, '');
                    this.getShippingOptions(this.selected_shipping.address);
                    this.selected_shipping_method = null;
                    this.shipping_method_string = '';
                    this.shipping_form_errors.FName = false;
                    this.shipping_form_errors.LName = false;
                    this.shipping_form_errors.Address1 = false;
                    this.shipping_form_errors.City = false;
                    this.shipping_form_errors.State = false;
                    this.shipping_form_errors.Zip = false;
                }
            );
    }
    shipping_form_errors: any = {
        FName: false,
        FName_string: 'First Name (Required)',
        LName: false,
        LName_string: 'Last Name (Required)',
        Phone: false,
        Phone_string: 'Phone Number (Required)',
        Phone_Ext_string: 'Phone Extension',
        Company_string: 'Company',
        Address1: false,
        Address1_string: 'Address Line 1 (Required)',
        Address2_string: 'Address Line 2',
        City: false,
        City_string: 'City (Required)',
        State: false,
        Zip: false,
        Zip_string: 'Postal Code (Required)'
    }
    showShippingFormErrors(value){
        for(let i = 0; i < value.length; i++){
            switch (value[i].Name){
                case 'shipping.FName':
                    this.shipping_form_errors.FName = true;
                    this.shipping_form_errors.FName_string = 'First Name Required';
                    break;
                case 'shipping.LName':
                    this.shipping_form_errors.LName = true;
                    this.shipping_form_errors.LName_string = 'Last Name Required';
                    break;
                case 'shipping.Phone':
                    this.shipping_form_errors.Phone = true;
                    this.shipping_form_errors.Phone_string = 'Phone Number Required';
                    break;
                case 'shipping.Address1':
                    this.shipping_form_errors.Address1 = true;
                    this.shipping_form_errors.Address1_string = 'Address Required';
                    break;
                case 'shipping.City':
                    this.shipping_form_errors.City = true;
                    this.shipping_form_errors.City_string = 'City Required';
                    break;
                case 'shipping.State':
                    this.shipping_form_errors.State = true;
                    break;
                case 'shipping.Zip':
                    this.shipping_form_errors.Zip = true;
                    this.shipping_form_errors.Zip_string = 'Postal Code Required';
                    break;
            }
        }
    }
    showAddAddress(value){
        this.show_add_address = !value;
        this.shipping_form_errors.FName = false;
        this.shipping_form_errors.LName = false;
        this.shipping_form_errors.Address1 = false;
        this.shipping_form_errors.City = false;
        this.shipping_form_errors.State = false;
        this.shipping_form_errors.Zip = false;
        this.edit_ship_address = false;
        if(value){
            this.selected_shipping.address = this.shipping_address.ShippingAddresses[0];
            this.selected_ship_address.option = 0;
            this.selected_shipping.index = 0;
            this.getShippingOptions(this.selected_shipping.address);
        }
    }
    onAddShipAddress(value, submitAddress: any, index: number){
        submitAddress = {
            CustId: 0,
            ShipToId: 0,
            FName: this.addShipAddressForm.value.firstname,
            LName: this.addShipAddressForm.value.lastname,
            Company: this.addShipAddressForm.value.company,
            Phone: this.addShipAddressForm.value.phone,
            Phone_Ext: this.addShipAddressForm.value.phoneext,
            Address1: this.addShipAddressForm.value.address1,
            Address2: this.addShipAddressForm.value.address2,
            City: this.addShipAddressForm.value.city,
            State: this.addShipAddressForm.value.state,
            Zip: this.addShipAddressForm.value.zip
        };
        this._sa.addShippingAddress(submitAddress, this.user_token)
            .subscribe(
                data => this.shipping_address = data,
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                    this.shipping_form_error = error.json();
                    this.showShippingFormErrors(this.shipping_form_error.PropertyErrors);
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.shipping_address);
                    }
                    index = 0;
                    this.show_add_address = !value;
                    this.selected_ship_address = { option: index };

                    this.selected_shipping.address = submitAddress;
                    this.shipping_form_errors.FName = false;
                    this.shipping_form_errors.LName = false;
                    this.shipping_form_errors.Phone = false;
                    this.shipping_form_errors.Address1 = false;
                    this.shipping_form_errors.City = false;
                    this.shipping_form_errors.State = false;
                    this.shipping_form_errors.Zip = false;
                    this.onChangeAddress(this.shipping_address.ShippingAddresses[0], 0);
                }
            );
    }
    on_load_ship_methods: boolean = false;
    getShippingOptions(address){
        this.on_load_ship_methods = true;

        this._sa.getShippingOptions(address)
            .subscribe(
                data => {
                    this.checkout = data;
                },
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                    this.on_load_ship_methods = false;
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.checkout);
                    }
                    this.new_shipping_options = this.checkout.ShippingOptions.ShippingOptionsVisible;
                    this.shipping_options = this.checkout.ShippingOptions.ShippingOptions;
                    this.setShippingMethodArray(this.shipping_options);
                    this.on_load_ship_methods = false;
                    this.has_custom_product = this.checkout.OrderSummary.HasCustomProducts;
                    this.has_customer_product_user = this.checkout.OrderSummary.HasCustomProductsUserEntered;
                }
            );
    }
    shipping_methods: Array<any>;

    std_tool_tip: string = 'Kenco will use multiple shipping carriers to get product to customer at the best value';
    exp_tool_tip: string = 'Kenco will use multiple shipping carriers to get product to customer in an estimated two business day turnaround';
    cp_tool_tip: string = 'Customer will pick up merchandise at Kenco - 5.6% Sales tax will be added';
    ups_tool_tip: string = 'Enter your UPS account number and select shipping method';
    fedex_tool_tip: string = 'Enter your FedEx account number and select shipping method';

    setShippingMethodArray(array){
        this.shipping_methods = [];
        for(var i = 0; i < array.length; i++){
            switch (array[i].ServiceCode){
                case 'STD':
                    array[i].index = i;
                    if(array[i].ServiceName != 'Standard Shipping'){
                        array[i].Name = array[i].ServiceName;
                    } else if(this.has_custom_product){
                        array[i].Name = 'Standard Shipping';
                    } else {
                        array[i].Name = 'Standard Shipping -';
                    }
                    this.shipping_methods.push(array[i]);
                    break;
                case '02':
                    array[i].index = i;
                    if(this.has_custom_product){
                        array[i].Name = 'Expedited Shipping';
                    } else {
                        array[i].Name = 'Expedited Shipping -';
                    }
                    array[i].Description = 'Expedited Shipping';
                    this.shipping_methods.push(array[i]);
                    break;
                case 'CP':
                    array[i].index = i;
                    array[i].Name = 'Customer Pickup';
                    this.shipping_methods.push(array[i]);
                    break;
                case 'BT':
                    array[i].index = i;
                    array[i].Name = 'Bill To My UPS Account';
                    array[i].CostText = '';
                    this.shipping_methods.push(array[i]);
                    break;
            }
        }
        let fedex_bt = {
            Cost: 0,
            CostText: '',
            Description: 'Bill to My Account',
            Name: 'Bill To My FedEx Account',
            ServiceAcct: '',
            ServiceCarrier: 'BillTo',
            ServiceCode: 'BT',
            ServiceName: 'Bill-To',
            index: array.length - 1
        };
        this.shipping_methods.push(fedex_bt);
        if(this.is_debug_on){
            console.log(this.shipping_methods);
        }
    }
    row_selected_shipping: Object = {};
    selected_shipping_method: number;
    show_ups_shipping_acct_field: boolean;
    show_fedex_shipping_acct_field: boolean;
    ship_option_service_code: string;
    onShipChangeMethod(idx, option_idx, service_code){
        var row = idx + 1;
        this.row_selected_shipping = {
            RowId: row
        };
        this._sa.setShippingOption(this.row_selected_shipping)
            .subscribe(
                data => {
                    this.checkout = data;
                },
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.checkout);
                    }
                    this.selected_shipping_method = option_idx;
                    if(option_idx === 1){
                        this.shipping_method_string = this.shipping_methods[option_idx].Description;
                    } else {
                        this.shipping_method_string = this.shipping_methods[option_idx].Name;
                    }
                    this.ups_number = '';
                    this.ups_billing_method_string = '';
                    this.fedex_number = '';
                    this.fedex_billing_method_string = '';
                    this.ship_option_service_code = service_code;
                    this.shippingMethodCases(option_idx);
                    this.has_custom_product = this.checkout.OrderSummary.HasCustomProducts;
                    this.has_customer_product_user = this.checkout.OrderSummary.HasCustomProductsUserEntered;
                }
            );
    }
    onBillToSelect(idx, option_idx, service_code) {
        this.fedex_billing_method_string = '';
        this.fedex_number = '';
        this.fedex_billing_info.RowId = null;
        this.fedex_billing_info.ServiceName = '';
        this.fedex_billing_info.ServiceAccount = '';
        this.ups_billing_method_string = '';
        this.ups_number = '';
        this.ups_billing_info.RowId = null;
        this.ups_billing_info.ServiceName = '';
        this.ups_billing_info.ServiceAccount = '';
        var row = idx + 1;
        this.row_selected_shipping = {
            RowId: row
        };
        this.ship_option_service_code = service_code;
        this.shipping_method_string = this.shipping_methods[option_idx].Name;
        this.shippingMethodCases(option_idx);
    }
    ups_shipping_methods: Array<any> = [
        {
            id: 'ship-method-ups-ground',
            name: 'ups_shipping',
            value: 'Standard Shipping',
            label: 'UPS Ground'
        },
        {
            id: 'ship-method-ups-2-day',
            name: 'ups_shipping',
            value: 'UPS 2-Day Air',
            label: 'UPS 2-Day Air'
        },
        {
            id: 'ship-method-ups-air',
            name: 'ups_shipping',
            value: 'UPS Next Day Air',
            label: 'UPS Next Day Air'
        }
    ];
    ups_billing_info: any = {
        RowId: null,
        ServiceCarrier: 'UPS',
        ServiceName: '',
        ServiceAccount: ''
    }
    ups_number: any;
    ups_billing_method_string: string;
    onUpsBilling(idx, option){
        let row = idx + 1;
        console.log(row);
        this.ups_billing_info.RowId = row;
        this.ups_billing_info.ServiceName = option;
        this.ups_billing_info.ServiceAccount = this.ups_number;
        this._sa.setBillToOption(this.ups_billing_info)
            .subscribe(
                data => {
                    this.checkout = data;
                },
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.checkout);
                    }
                    this.ups_billing_method_string = option;
                    this.selected_shipping_method = row - 1;
                    this.has_custom_product = this.checkout.OrderSummary.HasCustomProducts;
                    this.has_customer_product_user = this.checkout.OrderSummary.HasCustomProductsUserEntered;
                }
            );
    }
    fedex_shipping_methods: Array<any> = [
        {
            id: 'ship-method-fedex-ground',
            name: 'fedex_shipping',
            value: 'FedEx Ground',
            label: 'FedEx Ground'
        },
        {
            id: 'ship-method-fedex-express',
            name: 'fedex_shipping',
            value: 'FedEx Express',
            label: 'FedEx Express'
        },
        {
            id: 'ship-method-fedex-twoday',
            name: 'fedex_shipping',
            value: 'FedEx Two Day',
            label: 'FedEx Two Day'
        }
    ];
    fedex_billing_info: any = {
        RowId: null,
        ServiceCarrier: 'FEDEX',
        ServiceName: '',
        ServiceAccount: ''
    }
    fedex_number: any;
    fedex_billing_method_string: string;
    onFedExBilling(idx, option){
        let row = idx + 1;
        console.log(row);
        this.fedex_billing_info.RowId = row;
        this.fedex_billing_info.ServiceName = option;
        this.fedex_billing_info.ServiceAccount = this.fedex_number;
        this._sa.setBillToOption(this.fedex_billing_info)
            .subscribe(
                data => {
                    this.checkout = data;
                },
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.checkout);
                    }
                    this.fedex_billing_method_string = option;
                    this.selected_shipping_method = row - 1;
                    this.has_custom_product = this.checkout.OrderSummary.HasCustomProducts;
                    this.has_customer_product_user = this.checkout.OrderSummary.HasCustomProductsUserEntered;
                }
            );
    }
    shippingMethodCases(option_idx){
        switch(this.shipping_methods[option_idx].ServiceCode){
            case 'BT':
                if(this.shipping_methods[option_idx].Name === 'Bill To My UPS Account'){
                    this.show_ups_shipping_acct_field = true;
                    this.show_fedex_shipping_acct_field = false;
                    this.shipping_method_string = 'Bill To My UPS Account';
                    // this.checkout.ShippingOptions.SelectedBillToService.ServiceCarrier = 'UPS';
                } else {
                    // this.checkout.ShippingOptions.SelectedBillToService.ServiceCarrier = 'FEDEX';
                    this.show_ups_shipping_acct_field = false;
                    this.show_fedex_shipping_acct_field = true;
                    this.shipping_method_string = 'Bill To My FedEx Account';
                }
                break;
            default:
                this.show_ups_shipping_acct_field = false;
                this.show_fedex_shipping_acct_field = false;
                break;
        }
    }

    coupon_code: CouponCode = new CouponCode;
    shipping_options: Array<any>;
    setCouponCode(value){
        if(this.is_debug_on) {
            console.log(value);
        }
        this.coupon_code.EnteredCouponCode = value;
    }
    applyCouponCode(){
        console.log(this.coupon_code);
        this._coupon.saveCouponCode(this.coupon_code)
            .subscribe(
                data => {
                    this.checkout = data;
                },
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.checkout);
                    }
                    this.display_coupon_code = this.checkout.Coupon.CouponDeleteVisible;
                    this.shipping_options = this.checkout.ShippingOptions.ShippingOptions;
                    this.setShippingMethodArray(this.shipping_options);
                    this.selected_shipping_method = null;
                    this.has_custom_product = this.checkout.OrderSummary.HasCustomProducts;
                    this.has_customer_product_user = this.checkout.OrderSummary.HasCustomProductsUserEntered;
                }
            );
    }
    changeCouponCode(){
        this._coupon.deleteCouponCode()
            .subscribe(
                data => {
                    this.checkout = data;
                },
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.checkout);
                    }
                    this.display_coupon_code = this.checkout.Coupon.CouponDeleteVisible;this.shipping_options = this.checkout.ShippingOptions.ShippingOptions;
                    this.selected_shipping_method = null;
                    this.coupon_code.EnteredCouponCode = '';
                    this.shipping_method_string = '';
                    this.setShippingMethodArray(this.shipping_options);
                    this.has_custom_product = this.checkout.OrderSummary.HasCustomProducts;
                    this.has_customer_product_user = this.checkout.OrderSummary.HasCustomProductsUserEntered;
                }
            );
    }
    ship_method_error: boolean;
    ship_method_error_string: string = 'Please pick a shipping method';
    saveShipMethod(){
        if(this.checkout.ShippingOptions.ShippingAddress.ShipToId < 1){
            this.ship_method_error = true;
            this.ship_method_error_string = 'Please Save Your Shipping Address';
            console.log(this.checkout.ShippingOptions.ShippingAddress.ShipToId);
        } else {
            switch (this.ship_option_service_code){
                case 'STD':
                    this.showShippingPanel = false;
                    this.hideShippingPanel = true;
                    this.shipping_complete = true;
                    this.ship_method_error = false;
                    break;
                case '02':
                    this.showShippingPanel = false;
                    this.hideShippingPanel = true;
                    this.shipping_complete = true;
                    this.ship_method_error = false;
                    break;
                case 'CP':
                    this.showShippingPanel = false;
                    this.hideShippingPanel = true;
                    this.shipping_complete = true;
                    this.ship_method_error = false;
                    break;
                case 'BT':
                    if(this.checkout.ShippingOptions.SelectedBillToService.ServiceCarrier === 'UPS') {
                        if (!this.ups_number) {
                            this.ship_method_error = true;
                            this.ship_method_error_string = 'Please Enter a UPS Shipping Account';
                        } else if (this.ups_billing_info.ServiceName === '') {
                            this.ship_method_error = true;
                            this.ship_method_error_string = 'Please Select a UPS Shipping Method';
                        } else {
                            this.showShippingPanel = false;
                            this.hideShippingPanel = true;
                            this.shipping_complete = true;
                            this.ship_method_error = false;
                        }
                    } else {
                        if (!this.fedex_number) {
                            this.ship_method_error = true;
                            this.ship_method_error_string = 'Please Enter a FedEx Shipping Account';
                        } else if (this.fedex_billing_info.ServiceName === '') {
                            this.ship_method_error = true;
                            this.ship_method_error_string = 'Please Select a FedEx Shipping Method';
                        } else {
                            this.showShippingPanel = false;
                            this.hideShippingPanel = true;
                            this.shipping_complete = true;
                            this.ship_method_error = false;
                        }
                    }
                    break;
                default:
                    this.ship_method_error = true;
                    break;
            }
        }

        if(this.isGuestCustomerAuth()){
            this.edit_bill_address = true;
        }
    }


    /**********   Billing Panel ************/
    billing_address: BillingAddress = new BillingAddress;
    bill_status: string = '';
    billing_complete: boolean;
    showBillingPanel: boolean = true;
    hideBillingPanel: boolean = false;
    edit_bill_address: boolean;
    po_input: string = '';

    onGetBillingAddress(token){
        let name = '';
        this._ba.getBillingAddress(token)
            .subscribe(
                data => this.billing_address = data,
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.billing_address);
                    }
                }
            );
    }
    enterPONumber(value){
        this.po_input = value;
    }
    toggleBillingPanel(newState){
        this.showBillingPanel = newState;
        this.hideBillingPanel = !newState;
        this.showLoginPanel = false;
        this.hideLoginPanel = true;
        this.showShippingPanel = false;
        this.hideShippingPanel = true;
    }
    onEditBillAddress(){
        this.edit_bill_address = true;
    }
    is_billing_saved: boolean;
    onSaveBillAddress(bill_status_string: string){
        if(this.same_as_ship.value){
            bill_status_string = 'Bill to: Same As Shipping';
        } else if(!this.same_as_ship.value) {
            bill_status_string = 'Bill to: ' + this.billing_address.Address1;
            if(this.billing_address.Address2.length > 0){
                bill_status_string += ', ' + this.billing_address.Address2;
            }
            if(this.billing_address.City.length > 0){
                bill_status_string += ', ' + this.billing_address.City;
            }
            bill_status_string += ', ' + this.billing_address.State;
            bill_status_string += ' ' + this.billing_address.Zip;
        }
        this.bill_status = bill_status_string;
        this._ba.editBillingAddress(this.billing_address, this.user_token)
            .subscribe(
                data => {
                    this.billing_address = data;
                },
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                    this.billing_form_error = error.json();
                    this.edit_bill_address = true;
                    this.showBillingFormErrors(this.billing_form_error.PropertyErrors);
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.billing_address);
                    }
                    this.edit_bill_address = false;
                    this.billing_form_errors.FName = false;
                    this.billing_form_errors.LName = false;
                    this.billing_form_errors.Phone = false;
                    this.billing_form_errors.Address1 = false;
                    this.billing_form_errors.City = false;
                    this.billing_form_errors.State = false;
                    this.billing_form_errors.Zip = false;

                }
            );
    }
    billing_form_error: any;
    billing_form_errors: any = {
        FName: false,
        FName_string: 'First Name (Required)',
        LName: false,
        LName_string: 'Last Name (Required)',
        ContactPhone: false,
        ContactPhone_string: 'Additional Phone',
        ContactPhoneExt_string: 'Phone Extension',
        Phone_string: 'Phone Number (Required)',
        Phone_Ext_string: 'Phone Extension',
        Fax_string: 'Fax Number',
        Company_string: 'Company',
        Address1: false,
        Address1_string: 'Address Line 1 (Required)',
        Address2_string: 'Address Line 2',
        City: false,
        City_string: 'City (Required)',
        State: false,
        Zip: false,
        Zip_string: 'Postal Code (Required)'
    }
    showBillingFormErrors(value){
        for(let i = 0; i < value.length; i++){
            switch (value[i].Name){
                case 'billing.FName':
                    this.billing_form_errors.FName = true;
                    this.billing_form_errors.FName_string = 'First Name Required';
                    break;
                case 'billing.LName':
                    this.billing_form_errors.LName = true;
                    this.billing_form_errors.LName_string = 'Last Name Required';
                    break;
                case 'billing.Phone':
                    this.billing_form_errors.Phone = true;
                    this.billing_form_errors.Phone_string = 'Phone Number Required';
                    break;
                case 'billing.Address1':
                    this.billing_form_errors.Address1 = true;
                    this.billing_form_errors.Address1_string = 'Address Required';
                    break;
                case 'billing.City':
                    this.billing_form_errors.City = true;
                    this.billing_form_errors.City_string = 'City Required';
                    break;
                case 'billing.State':
                    this.billing_form_errors.State = true;
                    break;
                case 'billing.Zip':
                    this.billing_form_errors.Zip = true;
                    this.billing_form_errors.Zip_string = 'Postal Code Required';
                    break;
            }
        }
    }
    same_as_ship: any = {
        value: false
    };
    billSameAsShip(){
        if(!this.same_as_ship.value){
            if(this.isReturnCustomerAuth()){
                this.same_as_ship.value = true;
                this.billing_address.FName = this.selected_shipping.address.FName;
                this.billing_address.LName = this.selected_shipping.address.LName;
                this.billing_address.Phone = this.selected_shipping.address.Phone;
                this.billing_address.Phone_Ext = this.selected_shipping.address.Phone_Ext;
                this.billing_address.Company = this.selected_shipping.address.Company;
                this.billing_address.Address1 = this.selected_shipping.address.Address1;
                this.billing_address.Address2 = this.selected_shipping.address.Address2;
                this.billing_address.City = this.selected_shipping.address.City;
                this.billing_address.State = this.selected_shipping.address.State;
                this.billing_address.Zip = this.selected_shipping.address.Zip;
            } else {
                this.same_as_ship.value = true;
                this.billing_address.FName = this.guestShippingAddress.FName;
                this.billing_address.LName = this.guestShippingAddress.LName;
                this.billing_address.Phone = this.guestShippingAddress.Phone;
                this.billing_address.Phone_Ext = this.guestShippingAddress.Phone_Ext;
                this.billing_address.Company = this.guestShippingAddress.Company;
                this.billing_address.Address1 = this.guestShippingAddress.Address1;
                this.billing_address.Address2 = this.guestShippingAddress.Address2;
                this.billing_address.City = this.guestShippingAddress.City;
                this.billing_address.State = this.guestShippingAddress.State;
                this.billing_address.Zip = this.guestShippingAddress.Zip;
            }
        } else {
            this.same_as_ship.value = false;
            this.billing_address.FName = '';
            this.billing_address.LName = '';
            this.billing_address.Phone = '';
            this.billing_address.Phone_Ext = '';
            this.billing_address.Company = '';
            this.billing_address.Address1 = '';
            this.billing_address.Address2 = '';
            this.billing_address.City = '';
            this.billing_address.State = '';
            this.billing_address.Zip = '';
        }
    }
    payment_type: string = '';
    record_order_btn: string = 'Go To Payment';
    onSelectBillMethod(value, bill_status_string: string){
        this.payment_type = value;
        if(this.same_as_ship.value){
            bill_status_string = 'Bill to: Same As Shipping';
        } else if(!this.same_as_ship.value) {
            bill_status_string = 'Bill to: ' + this.billing_address.Address1;
            if(this.billing_address.Address2.length > 0){
                bill_status_string += ', ' + this.billing_address.Address2;
            }
            if(this.billing_address.City.length > 0){
                bill_status_string += ', ' + this.billing_address.City;
            }
            bill_status_string += ', ' + this.billing_address.State;
            bill_status_string += ' ' + this.billing_address.Zip;
        }
        this.bill_status = bill_status_string;
        switch (this.payment_type) {
            case "PayPal":
                this.payment_type_string = "PayPal Payment";
                this.record_order_btn = 'Go To Payment';
                break;
            case "Stripe":
                this.payment_type_string = "Credit Card Payment";
                this.record_order_btn = 'Go To Payment';
                break;
            case "Contact":
                this.payment_type_string = "Kenco Will Contact You for Payment";
                this.record_order_btn = 'Submit Order';
                break;
            case "Terms":
                this.payment_type_string = "Payment Terms With Kenco";
                this.record_order_btn = 'Submit Order';
                break;
        }
    }
    payment_type_error: boolean;
    payment_type_string: string = '';
    payment_type_error_string: string = '';
    setPaymentMethod(){
        if(this.is_debug_on){
            console.log(this.payment_type);
        }
        this._ba.editBillingAddress(this.billing_address, this.user_token)
            .subscribe(
                data => {
                    this.billing_address = data;
                },
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                    this.billing_form_error = error.json();
                    this.edit_bill_address = true;
                    this.showBillingFormErrors(this.billing_form_error.PropertyErrors);
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.billing_address);
                    }
                    this.edit_bill_address = false;
                    if(!this.payment_type){
                        this.payment_type_error = true;
                        this.payment_type_error_string = 'Please Select a Payment Type';
                    } else if(this.payment_type){
                        this.payment_type_error = false;
                        this.billing_complete = true;
                        this.hideLoginPanel = true;
                        this.showLoginPanel = false;
                        this.hideShippingPanel = true;
                        this.showShippingPanel = false;
                        this.hideBillingPanel = true;
                        this.showBillingPanel = false;
                        this.showSummary = false;
                    }
                }
            );
    }

    /******************* Order Review Panel **********************/
    showReviewPanel: boolean = true;
    hideReviewPanel: boolean = false;

    isComTermsChecked: boolean = false;
    isToUChecked: boolean = false;
    checkComTerms(){
        this.isComTermsChecked = !this.isComTermsChecked;
        this.isTermsAndConditionsFinished();
    }
    checkToU(){
        this.isToUChecked = !this.isToUChecked;
        this.isTermsAndConditionsFinished();
    }
    show_review_complete_btn: boolean = false;
    review_complete: boolean = false;
    isTermsAndConditionsFinished(){
        if(this.isToUChecked && this.isComTermsChecked){
            this.show_review_complete_btn = true;
            this.changePaymentHeader();
        } else {
            this.show_review_complete_btn = false;
        }
    }
    comTerms(){
        window.open("/info/commercialterms", "Commercial Terms", "menubar=1, resizable=1, width=500, height=500");
    }
    termsOfUse(){
        window.open("/info/termsofuse", "Terms of Use", "menubar=1, resizable=1, width=500, height=500");
    }
    recordOrderObject: any = {
        PaymentType: '',
        Notes: '',
        Confirm_TOU: false,
        Confirm_TOS: false,
        PONumber: ''
    };
    recordOrderResponse: any = {
        DisplayContinueVisible: false,
        DisplayContinueButtonUrl: '',
        Description: '',
        Error: '',
        Message: '',
        OrderDetails: {
            CouponDiscount: null,
            ImportFee: null,
            ItemSubTotal: null,
            OrderId: null,
            OrderNumber: '',
            OrderTotal: null,
            OrderTotalText: '',
            ShipRate: null,
            TaxAmount: null
        },
        OrderCompletedResponse: [{
            Script: '',
            Url: ''
        }]
    };
    payment_details_header: string = 'Payment Details';
    order_confirm_header: string = 'Payment';
    order_confirm_number: string = 'There has been an error with your order';
    order_total: '';
    continue_button_url: string = '';
    continue_button_text: string = 'Submit Order';
    display_continue_button: boolean = false;
    order_success: boolean;
    order_error: boolean;
    is_payment_error: boolean = false;
    payment_error_object: any = {
        Error: '',
        Description: '',
        PropertyErrors: ''
    }
    on_submit_order: boolean = false;
    record_order_errors: any = {
        isOrderError: false,
        Error: '',
        Description: ''
    }
    onRecordOrder(){
        if(this.checkout.ShippingOptions.ShippingAddress.ShipToId < 1){
            this.record_order_errors.isOrderError = true;
            this.record_order_errors.Error = 'Order Error';
            this.record_order_errors.Description = 'Please Select or Save A Shipping Address';
        } else if (this.selected_shipping_method === null){
            this.record_order_errors.isOrderError = true;
            this.record_order_errors.Error = 'Order Error';
            this.record_order_errors.Description = 'Please Select A Shipping Method';
        } else {
            this.record_order_errors.isOrderError = false;
            this.on_submit_order = true;
            this.review_complete = true;
            this.recordOrderObject.PaymentType = this.payment_type;
            this.recordOrderObject.Notes = this.order_notes;
            this.recordOrderObject.Confirm_TOU = this.isToUChecked;
            this.recordOrderObject.Confirm_TOS = this.isComTermsChecked;
            this.recordOrderObject.PONumber = this.po_input;
            this._sc.recordOrder(this.recordOrderObject, this.user_token)
                .subscribe(
                    data => {
                        this.recordOrderResponse = data;
                    },
                    error => {
                        if(this.is_debug_on){
                            console.error(error);
                        }
                        this.recordOrderResponse = error.json();
                        this.is_payment_error = true;
                        this.payment_error_object.Error = this.recordOrderResponse.Error;
                        this.payment_error_object.Description = this.recordOrderResponse.Message;
                        this.on_submit_order = false;
                    },
                    () => {
                        if(this.is_debug_on){
                            console.log(this.recordOrderResponse);
                        }
                        this.on_submit_order = false;
                        this.changePaymentHeader();
                        loadjs(this.recordOrderResponse.OrderCompletedScripts);
                    }
                );
        }
    }
    changePaymentHeader(){
        switch(this.recordOrderObject.PaymentType){
            case 'PayPal':
                this.payment_details_header = 'Submit Payment With PayPal - Order # ' + this.recordOrderResponse.OrderDetails.OrderNumber;
                this.order_confirm_header = 'Submit Payment With PayPal';
                this.order_confirm_number = this.recordOrderResponse.OrderDetails.OrderNumber;
                this.order_total = this.recordOrderResponse.OrderDetails.OrderTotalText;
                this.continue_button_url = this.recordOrderResponse.PayPalRedirect;
                this.continue_button_text = 'Continue To PayPal';
                break;
            case 'Stripe':
                this.payment_details_header = 'Submit Payment With Credit Card - Order # ' + this.recordOrderResponse.OrderDetails.OrderNumber;
                this.order_confirm_header = this.recordOrderResponse.Description;
                this.order_confirm_number = this.recordOrderResponse.OrderDetails.OrderNumber;
                this.order_total = this.recordOrderResponse.OrderDetails.OrderTotalText;
                break;
            case 'Terms':
                this.payment_details_header = this.recordOrderResponse.Description + ' - Order # ' + this.recordOrderResponse.OrderDetails.OrderNumber;
                this.order_confirm_header = 'Your Order Has Been Placed Based On Your Terms With Kenco';
                this.order_confirm_number = this.recordOrderResponse.OrderDetails.OrderNumber;
                this.order_total = this.recordOrderResponse.OrderDetails.OrderTotalText;
                this.continue_button_url = this.recordOrderResponse.DisplayContinueButtonUrl;
                this.display_continue_button = this.recordOrderResponse.DisplayContinueVisible;
                this.continue_button_text = 'Continue Shopping';
                break;
            case 'Contact':
                this.payment_details_header = this.recordOrderResponse.Description + ' - Order # ' + this.recordOrderResponse.OrderDetails.OrderNumber;
                this.order_confirm_header = this.recordOrderResponse.Description;
                this.order_total = this.recordOrderResponse.OrderDetails.OrderTotalText;
                this.order_confirm_number = this.recordOrderResponse.OrderDetails.OrderNumber;
                this.continue_button_url = this.recordOrderResponse.DisplayContinueButtonUrl;
                this.display_continue_button = this.recordOrderResponse.DisplayContinueVisible;
                this.continue_button_text = 'Continue Shopping';
                break;
            default:
                this.payment_details_header = 'Payment Details';
                break;
        }
    }

    /******************* Submit Payment Panel **********************/
    showPaymentPanel: boolean = true;
    hidePaymentPanel: boolean = false;
    stripe_error: boolean = false;
    stripe_success: boolean = false;
    stripe_message: string = '';
    stripe_param: string = '';
    stripeCCForm: ControlGroup;
    cart_complete: boolean;
    order_notes: string = '';
    stripe_card_number: string;
    stripe_card_cvc: string;
    stripe_card_exp_year: string = '00';
    stripe_card_exp_month: string = '00';
    stripe_obj: any = {
        number: '',
        cvc: '',
        exp_month: '',
        exp_year: ''
    }
    numberChange(value){
        this.stripe_obj.number = value;
        this.onGetStripeToken();
    }
    cvcChange(value){
        this.stripe_obj.cvc = value;
        this.onGetStripeToken();
    }
    monthChange(value){
        this.stripe_obj.exp_month = value;
        this.onGetStripeToken();
    }
    yearChange(value){
        this.stripe_obj.exp_year = value;
        this.onGetStripeToken();
    }
    onGetStripeToken(){
        if(this.is_debug_on){
            console.log(this.stripe_obj);
        }

        Stripe.card.createToken(this.stripe_obj, this.stripeResponseHandler.bind(this));
    }
    stripe_check: any = {
        id: '',
        card_type: ''
    }
    stripeResponseHandler(status, response):void{
        if(this.is_debug_on){
            console.log(response);
        }
        if(response.error){
            setTimeout(() => {
                this.stripe_error = true;
                this.stripe_success = false;
                this.stripe_message = response.error.message;
                this.stripe_param = response.error.param;
                if(this.is_debug_on){
                    console.error(response.error);
                }
                this.ref.detectChanges();
            }, 500);

        } else {
            setTimeout(() => {
                this.stripe_error = false;
                this.stripe_success = true;
                this.stripe_message = 'Approved';
                this.stripe_check.id = response.id;
                this.stripe_check.card_type = response.card.brand;
                if(this.is_debug_on){
                    console.log(response);
                }
                this.ref.detectChanges();
            }, 500);
        }
    }

    exp_year_array: Array<string> = [];
    current_year: number;
    getExpYear(){
        this.current_year = getCurrentYear();
        for(var i = 0; i <= 20; i++){
            this.exp_year_array.push(this.current_year.toString());
            this.current_year++;
        }
    }
    submit_stripe_data_obj: any = {
        TransactionId: '',
        TokenDetails: '',
        CardBrand: ''
    };
    stripe_payment_response: any = {};
    on_submit_payment: boolean = false;
    on_order_success: boolean = false;
    onSubmitStripePayment(){
        this.on_submit_payment = true;
        this.submit_stripe_data_obj.TransactionId = this.stripe_check.id;
        this.submit_stripe_data_obj.CardBrand = this.stripe_check.card_type;
        this._stripe.submitStripePayment(this.submit_stripe_data_obj, this.user_token)
            .subscribe(
                data => {
                    this.stripe_payment_response = data;
                },
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                    this.payment_error_object = error.json();
                    this.is_payment_error = true;
                    this.on_submit_payment = false;
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.stripe_payment_response);
                    }
                    this.on_submit_payment = false;
                    this.on_order_success = true;
                    this.order_confirm_number = this.stripe_payment_response.OrderDetails.OrderNumber;
                    this.payment_details_header = 'Thank you for your order - Order # ' + this.stripe_payment_response.OrderDetails.OrderNumber;
                    this.order_confirm_header = this.stripe_payment_response.Description;
                    this.continue_button_url = this.stripe_payment_response.DisplayContinueButtonUrl;
                    this.continue_button_text = 'Continue Shopping';
                    if(this.isGuestCustomerAuth()){
                        sessionStorage.removeItem('guest_email');
                        sessionStorage.removeItem('token');
                    }
                    loadjs(this.stripe_payment_response.OrderCompletedScripts);
                }
            );

    }
    onBailOutOfStripe(){
        this._stripe.bailOutOfStripe(this.user_token)
            .subscribe(
                data => {
                    this.stripe_payment_response = data;
                },
                error => {
                    if(this.is_debug_on){
                        console.error(error);
                    }
                    this.payment_error_object = error.json();
                    this.is_payment_error = true;
                    this.on_submit_payment = false;
                },
                () => {
                    if(this.is_debug_on){
                        console.log(this.stripe_payment_response);
                    }
                    this.on_order_success = true;
                    this.order_confirm_header = this.stripe_payment_response.Description;
                    this.continue_button_url = this.stripe_payment_response.DisplayContinueButtonUrl;
                    this.continue_button_text = 'Continue Shopping';
                    if(this.isGuestCustomerAuth()){
                        sessionStorage.removeItem('guest_email');
                        sessionStorage.removeItem('token');
                    }
                    loadjs(this.recordOrderResponse.OrderCompletedScripts);
                }
            );
    }


}
function getCurrentYear(){
    var d = new Date();
    var year = d.getFullYear();
    return year;
}
function loginHeader(){
    if(document.getElementById('loginLink')){
        var loginLink = document.getElementById('loginLink');
        var logoutLink = document.createElement('a');
        var registerLink = document.getElementById('registerLink');
        var myAccountLink = document.createElement('a');
        myAccountLink.href = '/Store/Manage';
        myAccountLink.title = 'Manage';
        myAccountLink.id = 'myAccountLink';
        myAccountLink.innerHTML = 'My Account';

        registerLink.parentNode.replaceChild(myAccountLink, registerLink);

        logoutLink.href='/Store/Account/LogOut';
        logoutLink.title = 'Log out';
        logoutLink.id = 'logoutLink';
        logoutLink.innerHTML = 'Log Out';
        logoutLink.onclick = function() {
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            localStorage.removeItem('new_user');
            sessionStorage.removeItem('guest_email');
            sessionStorage.removeItem('token');
            logoutLink.parentNode.replaceChild(loginLink, logoutLink);
        }
        loginLink.parentNode.replaceChild(logoutLink, loginLink);
    }
}
function welcomeHeader(value){
    var c = document.getElementsByClassName('welcome')[0].children.length;
    // console.log(c);
    if(c <= 0){
        var welcomeClass = document.getElementsByClassName('welcome')[0];
        var welcomeLink = document.createElement('a');
        var welcomeText = 'Welcome ' + value;
        welcomeLink.id = 'welcomeLink';
        welcomeLink.innerHTML = welcomeText;
        welcomeLink.href = '/Store/Manage';
        welcomeClass.appendChild(welcomeLink);
    } else {
        var welcomeLink = document.getElementsByClassName('welcome')[0].children[0];
        welcomeLink.id = 'welcomeLink';
        welcomeLink.innerHTML = 'Welcome ' + value;
    }
}
function logoutHeader(){
    if(document.getElementById('logoutLink')){
        var logoutLink = document.getElementById('logoutLink');
        var myAccountLink = document.getElementById('myAccountLink');
        var welcomeLink = document.getElementsByClassName('welcome')[0];
        var welcomeATag = welcomeLink.getElementsByTagName('a')[0];
        welcomeLink.removeChild(welcomeATag);

        var registerLink = document.createElement('a');
        registerLink.href = '/Store/Account/Register';
        registerLink.id = 'registerLink';
        registerLink.innerHTML = 'Register';
        myAccountLink.parentNode.replaceChild(registerLink, myAccountLink);

        var loginLink = document.createElement('a');
        loginLink.href= '/Store/Account/Login';
        loginLink.id = 'loginLink';
        loginLink.innerHTML = 'Log In';
        logoutLink.parentNode.replaceChild(loginLink, logoutLink);
    }
}
function ifCurrentUserLogin(){
    if(document.getElementById('logoutLink')) {
        var logoutLink = document.getElementById('logoutLink');
        logoutLink.onclick = function () {
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            localStorage.removeItem('new_user');
            localStorage.removeItem('expires');
            sessionStorage.removeItem('guest_email');
            sessionStorage.removeItem('token');
        }
    }
}
function getStripePubKey(){
    var metas = document.getElementsByTagName('meta');

    for(var i=0; i < metas.length; i++){
        if(metas[i].getAttribute("name") == "publishable_key"){
            return metas[i].getAttribute("content");
        }
    }
    return "";
}
function setExpiresToken(value){
    var d = new Date();
    var current_ms = d.getTime();
    var current = current_ms/1000;
    var expires = current + value;
    return expires;
}
function loadjs(array) {
    var headtag = document.getElementsByTagName('head');
    if(array != null){
        for(var j = 0; j < array.length; j++){
            var scripttag = document.createElement('script');
            var url = array[j].Url;
            scripttag.setAttribute('type', 'text/javascript');
            if(url.length != 0){
                scripttag.setAttribute('src', url);
            }
            var scr = array[j].Script;
            if(scr.length != 0){
                scripttag.innerHTML = scr;
            }
            headtag[0].appendChild(scripttag);
        }
    }
}
