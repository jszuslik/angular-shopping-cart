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
var core_1 = require('@angular/core');
var checkout_1 = require("./checkout");
var checkout_service_1 = require("./checkout.service");
var auth_service_1 = require("./auth.service");
var common_1 = require("@angular/common");
var shipping_address_service_1 = require("./shipping-address.service");
var coupon_code_service_1 = require("./coupon-code.service");
var coupon_code_1 = require("./coupon-code");
var billing_address_1 = require("./billing-address");
var phone_number_pipe_1 = require("../pipes/phone-number.pipe");
var billing_address_service_1 = require("./billing-address.service");
var stripe_service_1 = require("./stripe.service");
var CheckoutComponent = (function () {
    function CheckoutComponent(_sc, _auth, _fb, _sa, _coupon, ref, _ba, _stripe) {
        this._sc = _sc;
        this._auth = _auth;
        this._fb = _fb;
        this._sa = _sa;
        this._coupon = _coupon;
        this.ref = ref;
        this._ba = _ba;
        this._stripe = _stripe;
        this.is_debug_on = false;
        /************  Order Summary Panel  *******************/
        this.showModify = false;
        this.modify_state = 'Modify Cart';
        this.showSummary = true;
        this.checkout = new checkout_1.Checkout;
        this.has_custom_product = false;
        this.has_customer_product_user = false;
        this.cart_item_id = {
            ItemId: ''
        };
        this.cart_item_qty = {
            ItemId: '',
            Qty: ''
        };
        /**********   Login Panel ************/
        this.showLoginPanel = true;
        this.hideLoginPanel = false;
        this.user_token = localStorage.getItem('token');
        this.signin_error = '';
        this.access_token = {
            "access_token": '',
            "token_type": '',
            "expires_in": '',
            "userName": '',
            ".issued": '',
            ".expires": ''
        };
        this.user_details_object = {
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
        };
        this.new_confirm_message = {};
        this.new_error_message = {
            Message: '',
            Error: '',
            Description: '',
            ModelState: {}
        };
        this.guest_cust_email = sessionStorage.getItem('guest_email');
        this.showShippingPanel = true;
        this.hideShippingPanel = false;
        this.shipping_address = {
            ShippingAddresses: []
        };
        this.states = [
            { key: '', value: 'Choose A State', disabled: true },
            { key: 'AL', value: 'Alabama' },
            { key: 'AK', value: 'Alaska' },
            { key: 'AZ', value: 'Arizona' },
            { key: 'AR', value: 'Arkansas' },
            { key: 'CA', value: 'California' },
            { key: 'CO', value: 'Colorado' },
            { key: 'CT', value: 'Connecticut' },
            { key: 'DE', value: 'Delaware' },
            { key: 'DC', value: 'District of Columbia' },
            { key: 'FL', value: 'Florida' },
            { key: 'GA', value: 'Georgia' },
            { key: 'HI', value: 'Hawaii' },
            { key: 'ID', value: 'Idaho' },
            { key: 'IL', value: 'Illinois' },
            { key: 'IN', value: 'Indiana' },
            { key: 'IA', value: 'Iowa' },
            { key: 'KS', value: 'Kansas' },
            { key: 'KY', value: 'Kentucky' },
            { key: 'LA', value: 'Louisiana' },
            { key: 'ME', value: 'Maine' },
            { key: 'MD', value: 'Maryland' },
            { key: 'MA', value: 'Massachusetts' },
            { key: 'MI', value: 'Michigan' },
            { key: 'MN', value: 'Minnesota' },
            { key: 'MS', value: 'Mississippi' },
            { key: 'MO', value: 'Missouri' },
            { key: 'MT', value: 'Montana' },
            { key: 'NE', value: 'Nebraska' },
            { key: 'NV', value: 'Nevada' },
            { key: 'NH', value: 'New Hampshire' },
            { key: 'NJ', value: 'New Jersey' },
            { key: 'NM', value: 'New Mexico' },
            { key: 'NY', value: 'New York' },
            { key: 'NC', value: 'North Carolina' },
            { key: 'ND', value: 'North Dakota' },
            { key: 'OH', value: 'Ohio' },
            { key: 'OK', value: 'Oklahoma' },
            { key: 'OR', value: 'Oregon' },
            { key: 'PA', value: 'Pennsylvania' },
            { key: 'RI', value: 'Rhode Island' },
            { key: 'SC', value: 'South Carolina' },
            { key: 'SD', value: 'South Dakota' },
            { key: 'TN', value: 'Tennessee' },
            { key: 'TX', value: 'Texas' },
            { key: 'UT', value: 'Utah' },
            { key: 'VT', value: 'Vermont' },
            { key: 'VA', value: 'Virginia' },
            { key: 'WA', value: 'Washington' },
            { key: 'WV', value: 'West Virginia' },
            { key: 'WI', value: 'Wisconsin' },
            { key: 'WY', value: 'Wyoming' },
            { key: 'provinces', value: 'Canadian Provinces', disabled: true },
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
            { key: 'YT', value: 'Yukon' }
        ];
        this.selected_ship_address = {
            option: null
        };
        this.is_address_selected = false;
        this.selected_shipping = {
            address: {},
            index: null
        };
        this.guest_shipping_address = {
            ShippingAddresses: []
        };
        this.guestShippingAddress = {
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
        this.show_guest_address_form = true;
        this.shipping_form_errors = {
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
        };
        this.on_load_ship_methods = false;
        this.std_tool_tip = 'Kenco will use multiple shipping carriers to get product to customer at the best value';
        this.exp_tool_tip = 'Kenco will use multiple shipping carriers to get product to customer in an estimated two business day turnaround';
        this.cp_tool_tip = 'Customer will pick up merchandise at Kenco - 5.6% Sales tax will be added';
        this.ups_tool_tip = 'Enter your UPS account number and select shipping method';
        this.fedex_tool_tip = 'Enter your FedEx account number and select shipping method';
        this.row_selected_shipping = {};
        this.ups_shipping_methods = [
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
        this.ups_billing_info = {
            RowId: null,
            ServiceCarrier: 'UPS',
            ServiceName: '',
            ServiceAccount: ''
        };
        this.fedex_shipping_methods = [
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
        this.fedex_billing_info = {
            RowId: null,
            ServiceCarrier: 'FEDEX',
            ServiceName: '',
            ServiceAccount: ''
        };
        this.coupon_code = new coupon_code_1.CouponCode;
        this.ship_method_error_string = 'Please pick a shipping method';
        /**********   Billing Panel ************/
        this.billing_address = new billing_address_1.BillingAddress;
        this.bill_status = '';
        this.showBillingPanel = true;
        this.hideBillingPanel = false;
        this.po_input = '';
        this.billing_form_errors = {
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
        };
        this.same_as_ship = {
            value: false
        };
        this.payment_type = '';
        this.record_order_btn = 'Go To Payment';
        this.payment_type_string = '';
        this.payment_type_error_string = '';
        /******************* Order Review Panel **********************/
        this.showReviewPanel = true;
        this.hideReviewPanel = false;
        this.isComTermsChecked = false;
        this.isToUChecked = false;
        this.show_review_complete_btn = false;
        this.review_complete = false;
        this.recordOrderObject = {
            PaymentType: '',
            Notes: '',
            Confirm_TOU: false,
            Confirm_TOS: false,
            PONumber: ''
        };
        this.recordOrderResponse = {
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
        this.payment_details_header = 'Payment Details';
        this.order_confirm_header = 'Payment';
        this.order_confirm_number = 'There has been an error with your order';
        this.continue_button_url = '';
        this.continue_button_text = 'Submit Order';
        this.display_continue_button = false;
        this.is_payment_error = false;
        this.payment_error_object = {
            Error: '',
            Description: '',
            PropertyErrors: ''
        };
        this.on_submit_order = false;
        this.record_order_errors = {
            isOrderError: false,
            Error: '',
            Description: ''
        };
        /******************* Submit Payment Panel **********************/
        this.showPaymentPanel = true;
        this.hidePaymentPanel = false;
        this.stripe_error = false;
        this.stripe_success = false;
        this.stripe_message = '';
        this.stripe_param = '';
        this.order_notes = '';
        this.stripe_card_exp_year = '00';
        this.stripe_card_exp_month = '00';
        this.stripe_obj = {
            number: '',
            cvc: '',
            exp_month: '',
            exp_year: ''
        };
        this.stripe_check = {
            id: '',
            card_type: ''
        };
        this.exp_year_array = [];
        this.submit_stripe_data_obj = {
            TransactionId: '',
            TokenDetails: '',
            CardBrand: ''
        };
        this.stripe_payment_response = {};
        this.on_submit_payment = false;
        this.on_order_success = false;
        if (this.is_debug_on) {
            console.log('Debug mode is on. Change "is_debug_on" to false when in production');
        }
        this.publishable_key = getStripePubKey();
        this.onGetCheckout();
        this.onGetCurrentUserToken();
        Stripe.setPublishableKey(this.publishable_key);
        this.returnCustomerForm = this._fb.group({
            'email': ['', common_1.Validators.required],
            'password': ['', common_1.Validators.required]
        });
        this.newCustomerForm = this._fb.group({
            'Email': ['', common_1.Validators.required],
            'Password': ['', common_1.Validators.required],
            'ConfirmPassword': ['', common_1.Validators.required]
        });
        this.guestCustomerForm = this._fb.group({
            'Email': ['', common_1.Validators.required]
        });
        if (this.isReturnCustomerAuth()) {
            this.onGetShippingAddress(this.user_token);
            this.onGetBillingAddress(this.user_token);
        }
        else if (this.isGuestCustomerAuth()) {
            this.user_token = sessionStorage.getItem('token');
            this.onGetShippingAddress(this.user_token);
            this.onGetBillingAddress(this.user_token);
        }
        this.addShipAddressForm = this._fb.group({
            'firstname': ['', common_1.Validators.compose([
                    common_1.Validators.required,
                    common_1.Validators.minLength(1)
                ])],
            'lastname': ['', common_1.Validators.compose([
                    common_1.Validators.required,
                    common_1.Validators.minLength(1)
                ])],
            'phone': ['', common_1.Validators.compose([
                    common_1.Validators.required,
                    common_1.Validators.minLength(1)
                ])],
            'phoneext': [''],
            'company': [''],
            'address_type': ['none'],
            'address1': ['', common_1.Validators.compose([
                    common_1.Validators.required,
                    common_1.Validators.minLength(1)
                ])],
            'address2': [''],
            'city': ['', common_1.Validators.compose([
                    common_1.Validators.required,
                    common_1.Validators.minLength(1)
                ])],
            'state': [''],
            'zip': ['', common_1.Validators.compose([
                    common_1.Validators.required,
                    common_1.Validators.minLength(1)
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
    CheckoutComponent.prototype.ngOnInit = function () {
    };
    CheckoutComponent.prototype.onShowSummary = function (value) {
        if (this.is_debug_on) {
            console.log(value);
        }
        this.showSummary = !value;
    };
    CheckoutComponent.prototype.onGetCheckout = function () {
        var _this = this;
        this._sc.getShoppingCart()
            .subscribe(function (data) {
            _this.checkout = data;
        }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.checkout);
            }
            _this.has_custom_product = _this.checkout.OrderSummary.HasCustomProducts;
            _this.has_customer_product_user = _this.checkout.OrderSummary.HasCustomProductsUserEntered;
        });
    };
    CheckoutComponent.prototype.onClearCart = function () {
        var _this = this;
        this._sc.clearCart()
            .subscribe(function (data) {
            _this.checkout = data;
        }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.checkout);
            }
            _this.has_custom_product = _this.checkout.OrderSummary.HasCustomProducts;
            _this.has_customer_product_user = _this.checkout.OrderSummary.HasCustomProductsUserEntered;
        });
    };
    CheckoutComponent.prototype.onResetOptions = function () {
        var _this = this;
        this._sc.resetOptions()
            .subscribe(function (data) {
            _this.checkout = data;
        }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.checkout);
            }
            _this.has_custom_product = _this.checkout.OrderSummary.HasCustomProducts;
            _this.has_customer_product_user = _this.checkout.OrderSummary.HasCustomProductsUserEntered;
        });
    };
    CheckoutComponent.prototype.onModify = function () {
        if (!this.showModify) {
            this.showModify = true;
            this.modify_state = "Save Cart";
        }
        else {
            this.showModify = false;
            this.modify_state = "Modify Cart";
        }
    };
    CheckoutComponent.prototype.onDeleteCartItem = function (id) {
        var _this = this;
        var r = confirm("You are about to delete this item from the cart. Are you sure?");
        if (r) {
            this.cart_item_id.ItemId = id;
            this._sc.removeCartItem(this.cart_item_id)
                .subscribe(function (data) {
                _this.checkout = data;
            }, function (error) {
                if (_this.is_debug_on) {
                    console.error(error);
                }
            }, function () {
                if (_this.is_debug_on) {
                    console.log(_this.checkout);
                }
                if (_this.isReturnCustomerAuth()) {
                    _this.getShippingOptions(_this.selected_shipping.address);
                }
                else if (_this.isGuestCustomerAuth()) {
                    _this.getShippingOptions(_this.guestShippingAddress);
                }
                _this.has_custom_product = _this.checkout.OrderSummary.HasCustomProducts;
                _this.has_customer_product_user = _this.checkout.OrderSummary.HasCustomProductsUserEntered;
                _this.selected_shipping_method = null;
                _this.ups_billing_method_string = null;
                _this.ups_number = null;
                _this.shipping_method_string = null;
                _this.fedex_billing_method_string = null;
                _this.fedex_number = null;
            });
        }
    };
    CheckoutComponent.prototype.addItem = function (id, current_qty) {
        var new_qty;
        if (this.is_debug_on) {
            console.log(current_qty);
        }
        new_qty = current_qty + 1;
        if (this.is_debug_on) {
            console.log(new_qty);
        }
        this.onUpdateCartItemQty(id, new_qty);
    };
    CheckoutComponent.prototype.setCurrentQty = function (idx) {
        this.current_item_qty = this.checkout.OrderSummary.Cart_Items[idx].Qty;
        if (this.is_debug_on) {
            console.log(this.current_item_qty);
        }
    };
    CheckoutComponent.prototype.inputUpdateCart = function (idx, id, qty) {
        if (qty <= 0) {
            var r = confirm("You are about change the Qty of this item to Zero. This will remove the item from the cart.");
            if (r) {
                this.onUpdateCartItemQty(id, qty);
            }
            else {
                this.onUpdateCartItemQty(id, this.current_item_qty);
            }
        }
        else {
            this.onUpdateCartItemQty(id, qty);
        }
    };
    CheckoutComponent.prototype.removeItem = function (id, current_qty) {
        if (current_qty > 1) {
            var new_qty = void 0;
            if (this.is_debug_on) {
                console.log(current_qty);
            }
            new_qty = current_qty - 1;
            if (this.is_debug_on) {
                console.log(new_qty);
            }
            this.onUpdateCartItemQty(id, new_qty);
        }
        else {
            var r = confirm("You are about change the Qty of this item to Zero. This will remove the item from the cart.");
            if (r) {
                var new_qty = void 0;
                if (this.is_debug_on) {
                    console.log(current_qty);
                }
                new_qty = current_qty - 1;
                if (this.is_debug_on) {
                    console.log(new_qty);
                }
                this.onUpdateCartItemQty(id, new_qty);
            }
        }
    };
    CheckoutComponent.prototype.onUpdateCartItemQty = function (id, new_qty) {
        var _this = this;
        this.cart_item_qty.ItemId = id;
        this.cart_item_qty.Qty = new_qty;
        this.selected_shipping_method = null;
        this.ups_billing_method_string = null;
        this.ups_number = null;
        this.shipping_method_string = null;
        this.fedex_billing_method_string = null;
        this.fedex_number = null;
        this._sc.updateCartItemQty(this.cart_item_qty)
            .subscribe(function (data) {
            _this.checkout = data;
        }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.checkout);
            }
            if (_this.isReturnCustomerAuth() && _this.is_address_selected) {
                console.log(_this.selected_shipping.address);
                _this.getShippingOptions(_this.selected_shipping.address);
            }
            else if (_this.isGuestCustomerAuth()) {
                console.log(_this.guestShippingAddress);
                _this.getShippingOptions(_this.guestShippingAddress);
            }
            _this.has_custom_product = _this.checkout.OrderSummary.HasCustomProducts;
            _this.has_customer_product_user = _this.checkout.OrderSummary.HasCustomProductsUserEntered;
        });
    };
    CheckoutComponent.prototype.setTaxExempt = function (itemid, is_tax_exempt) {
        var _this = this;
        var taxExemptSubmit = {
            ItemId: itemid,
            IsTaxExempt: is_tax_exempt
        };
        if (this.is_debug_on) {
            console.log(taxExemptSubmit);
        }
        this._sc.setTaxExemptOnItem(taxExemptSubmit)
            .subscribe(function (data) {
            _this.checkout = data;
        }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.checkout);
            }
            if (_this.isReturnCustomerAuth() && _this.is_address_selected) {
                console.log(_this.selected_shipping.address);
                _this.getShippingOptions(_this.selected_shipping.address);
            }
            else if (_this.isGuestCustomerAuth()) {
                console.log(_this.guestShippingAddress);
                _this.getShippingOptions(_this.guestShippingAddress);
            }
            _this.has_custom_product = _this.checkout.OrderSummary.HasCustomProducts;
            _this.has_customer_product_user = _this.checkout.OrderSummary.HasCustomProductsUserEntered;
            _this.selected_shipping_method = null;
            _this.ups_billing_method_string = null;
            _this.ups_number = null;
            _this.shipping_method_string = null;
            _this.fedex_billing_method_string = null;
            _this.fedex_number = null;
        });
    };
    CheckoutComponent.prototype.toggleLoginPanel = function (newState) {
        this.showLoginPanel = newState;
        this.hideLoginPanel = !newState;
        this.showShippingPanel = false;
        this.hideShippingPanel = true;
        this.showBillingPanel = false;
        this.hideBillingPanel = true;
    };
    CheckoutComponent.prototype.onSignin = function () {
        var _this = this;
        if (this.isReturnCustomerAuth() || this.isGuestCustomerAuth()) {
            this._auth.logout()
                .subscribe(function (data) {
                if (_this.is_debug_on) {
                    console.log(data);
                }
            }, function (error) {
                if (_this.is_debug_on) {
                    console.error(error);
                }
            }, function () {
                sessionStorage.removeItem('guest_email');
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('expires');
                localStorage.removeItem('email');
                localStorage.removeItem('expires');
                localStorage.removeItem('token');
                logoutHeader();
            });
        }
        this._auth.signinGetToken(this.returnCustomerForm.value)
            .subscribe(function (data) {
            _this.access_token = data;
        }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
            _this.signin_error_obj = error.json();
            _this.signin_error = _this.signin_error_obj.error_description;
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.access_token);
            }
            localStorage.setItem('token', _this.access_token.access_token);
            localStorage.setItem('expires', setExpiresToken(_this.access_token.expires_in));
            _this.user_token = _this.access_token.access_token;
            localStorage.setItem('email', _this.access_token.userName);
            _this.onGetShippingAddress(_this.user_token);
            _this.onGetBillingAddress(_this.user_token);
            _this.returnCustomerForm = _this._fb.group({
                'email': ['', common_1.Validators.required],
                'password': ['', common_1.Validators.required]
            });
            _this.signin_error = '';
            _this.guest_signin_error = '';
            _this.showLoginPanel = false;
            _this.hideLoginPanel = true;
            _this.showShippingPanel = true;
            _this.hideShippingPanel = false;
            loginHeader();
            _this.getUserDetails();
        });
    };
    CheckoutComponent.prototype.onGetCurrentUserToken = function () {
        var _this = this;
        this._auth.getCurrentToken()
            .subscribe(function (data) {
            _this.access_token = data;
        }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
            localStorage.removeItem('email');
            localStorage.removeItem('token');
            localStorage.removeItem('expires');
            sessionStorage.removeItem('guest_email');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('expires');
            _this.is_user_current = false;
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.access_token);
            }
            localStorage.setItem('token', _this.access_token.access_token);
            localStorage.setItem('email', _this.access_token.userName);
            localStorage.setItem('expires', setExpiresToken(_this.access_token.expires_in));
            _this.user_token = _this.access_token.access_token;
            _this.onGetShippingAddress(_this.user_token);
            _this.onGetBillingAddress(_this.user_token);
            _this.returnCustomerForm = _this._fb.group({
                'email': ['', common_1.Validators.required],
                'password': ['', common_1.Validators.required]
            });
            _this.signin_error = '';
            _this.guest_signin_error = '';
            _this.showLoginPanel = false;
            _this.hideLoginPanel = true;
            _this.showShippingPanel = true;
            _this.hideShippingPanel = false;
            ifCurrentUserLogin();
            _this.is_user_current = true;
            _this.getUserDetails();
        });
    };
    CheckoutComponent.prototype.getUserDetails = function () {
        var _this = this;
        this._auth.getUserDetails(this.user_token)
            .subscribe(function (data) {
            _this.user_details_object = data;
        }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
            _this.user_details_object = error;
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.user_details_object);
            }
            _this.return_cust_email = _this.user_details_object.Name;
            welcomeHeader(_this.user_details_object.Name);
            _this.showLoginPanel = false;
            _this.hideLoginPanel = true;
            _this.showShippingPanel = true;
            _this.hideShippingPanel = false;
            ifCurrentUserLogin();
        });
    };
    CheckoutComponent.prototype.onRegister = function () {
        var _this = this;
        if (this.isReturnCustomerAuth() || this.isGuestCustomerAuth()) {
            this._auth.logout()
                .subscribe(function (data) {
                if (_this.is_debug_on) {
                    console.log(data);
                }
            }, function (error) {
                if (_this.is_debug_on) {
                    console.error(error);
                }
            }, function () {
                sessionStorage.removeItem('guest_email');
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('expires');
                localStorage.removeItem('email');
                localStorage.removeItem('expires');
                localStorage.removeItem('token');
                logoutHeader();
            });
        }
        this._auth.registerGetToken(this.newCustomerForm.value)
            .subscribe(function (data) {
            _this.access_token = data;
        }, function (error) {
            _this.new_error_message = error.json();
            if (_this.is_debug_on) {
                console.error(_this.new_error_message);
            }
            if (_this.new_error_message.Error) {
                _this.new_signin_error = _this.new_error_message.Error;
            }
            else {
                _this.new_signin_error = '';
                _this.new_signin_error_cp = '';
                _this.new_signin_error_pw = '';
            }
            if (_this.new_error_message.Message) {
                _this.new_signin_error_msg = _this.new_error_message.Message;
            }
            else {
                _this.new_signin_error_msg = '';
                _this.new_signin_error_cp = '';
                _this.new_signin_error_pw = '';
            }
            if (_this.new_error_message.Description) {
                _this.new_signin_error_desc = _this.new_error_message.Description;
            }
            else {
                _this.new_signin_error_desc = '';
                _this.new_signin_error_cp = '';
                _this.new_signin_error_pw = '';
            }
            _this.new_signin_error_obj = JSON.stringify(_this.new_error_message.ModelState);
            if (_this.new_signin_error_obj) {
                _this.new_signin_error_pw_obj = JSON.parse(_this.new_signin_error_obj.replace("model.", ""));
                if ("Password" in _this.new_signin_error_pw_obj) {
                    _this.new_signin_error_pw = _this.new_signin_error_pw_obj.Password;
                    _this.new_signin_error_cp = '';
                }
                else if ("ConfirmPassword" in _this.new_signin_error_pw_obj) {
                    _this.new_signin_error_cp = _this.new_signin_error_pw_obj.ConfirmPassword;
                    _this.new_signin_error_pw = '';
                }
            }
            else {
                _this.new_signin_error_cp = '';
                _this.new_signin_error_pw = '';
            }
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.access_token);
            }
            // this.new_signin_success = this.new_confirm_message.Description;
            _this.new_signin_error = '';
            _this.new_signin_error_msg = '';
            _this.new_signin_error_desc = '';
            _this.new_signin_error_pw = '';
            _this.new_signin_error_cp = '';
            _this.newCustomerForm = _this._fb.group({
                'Email': ['', common_1.Validators.required],
                'Password': ['', common_1.Validators.required],
                'ConfirmPassword': ['', common_1.Validators.required]
            });
            localStorage.setItem('token', _this.access_token.access_token);
            localStorage.setItem('expires', setExpiresToken(_this.access_token.expires_in));
            _this.user_token = _this.access_token.access_token;
            localStorage.setItem('email', _this.access_token.userName);
            _this.onGetShippingAddress(_this.user_token);
            _this.onGetBillingAddress(_this.user_token);
            _this.signin_error = '';
            _this.guest_signin_error = '';
            _this.showLoginPanel = false;
            _this.hideLoginPanel = true;
            _this.showShippingPanel = true;
            _this.hideShippingPanel = false;
            loginHeader();
            _this.getUserDetails();
        });
    };
    CheckoutComponent.prototype.guestCheckout = function () {
        var _this = this;
        if (this.isReturnCustomerAuth() || this.isGuestCustomerAuth()) {
            this._auth.logout()
                .subscribe(function (data) {
                if (_this.is_debug_on) {
                    console.log(data);
                }
            }, function (error) {
                if (_this.is_debug_on) {
                    console.error(error);
                }
            }, function () {
                sessionStorage.removeItem('guest_email');
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('expires');
                localStorage.removeItem('email');
                localStorage.removeItem('expires');
                localStorage.removeItem('token');
                logoutHeader();
            });
        }
        this._auth.guestGetToken(this.guestCustomerForm.value)
            .subscribe(function (data) {
            _this.access_token = data;
        }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
            _this.guest_signin_error_obj = error.json();
            _this.guest_signin_error = _this.guest_signin_error_obj.Description;
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.access_token);
            }
            sessionStorage.setItem('token', _this.access_token.access_token);
            sessionStorage.setItem('guest_email', _this.access_token.userName);
            sessionStorage.setItem('expires', setExpiresToken(_this.access_token.expires_in));
            _this.guest_cust_email = _this.guestCustomerForm.value.Email;
            _this.user_token = _this.access_token.access_token;
            _this.onGetShippingAddress(_this.user_token);
            _this.onGetBillingAddress(_this.user_token);
            _this.guest_signin_error = '';
            _this.showLoginPanel = false;
            _this.hideLoginPanel = true;
            _this.showShippingPanel = true;
            _this.hideShippingPanel = false;
            _this.guestCustomerForm = _this._fb.group({
                'Email': ['', common_1.Validators.required]
            });
            _this.getUserDetails();
        });
    };
    CheckoutComponent.prototype.userLogout = function () {
        var _this = this;
        var r = confirm("You are about to logout.");
        if (r == true) {
            this._auth.logout()
                .subscribe(function (data) {
                if (_this.is_debug_on) {
                    console.log(data);
                }
            }, function (error) {
                if (_this.is_debug_on) {
                    console.error(error);
                }
            }, function () {
                localStorage.removeItem('token');
                localStorage.removeItem('email');
                localStorage.removeItem('new_user');
                localStorage.removeItem('expires');
                sessionStorage.removeItem('guest_email');
                sessionStorage.removeItem('token');
                _this.shipping_complete = false;
                _this.billing_complete = false;
                _this.review_complete = false;
                logoutHeader();
            });
        }
    };
    CheckoutComponent.prototype.sessionLogOut = function () {
        var _this = this;
        alert("You are being logged out due to a session timeout.");
        this._auth.logout()
            .subscribe(function (data) {
            if (_this.is_debug_on) {
                console.log(data);
            }
        }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
        }, function () {
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            localStorage.removeItem('new_user');
            localStorage.removeItem('expires');
            sessionStorage.removeItem('guest_email');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('expires');
            _this.shipping_complete = false;
            _this.billing_complete = false;
            _this.review_complete = false;
            logoutHeader();
        });
    };
    CheckoutComponent.prototype.isReturnCustomerAuth = function () {
        if (localStorage.getItem('email') && localStorage.getItem('token')) {
            return localStorage.getItem('token') !== null;
        }
    };
    CheckoutComponent.prototype.isGuestCustomerAuth = function () {
        if (sessionStorage.getItem('guest_email') && sessionStorage.getItem('token')) {
            return sessionStorage.getItem('token') !== null;
        }
    };
    CheckoutComponent.prototype.isAuth = function () {
        if (this.isReturnCustomerAuth() || this.isGuestCustomerAuth()) {
            return true;
        }
        else {
            return false;
        }
    };
    CheckoutComponent.prototype.toggleShippingPanel = function (newState) {
        this.showShippingPanel = newState;
        this.hideShippingPanel = !newState;
        this.showLoginPanel = false;
        this.hideLoginPanel = true;
        this.showBillingPanel = false;
        this.hideBillingPanel = true;
    };
    CheckoutComponent.prototype.onGetShippingAddress = function (token) {
        var _this = this;
        this._sa.getShippingAddress(token)
            .subscribe(function (data) { return _this.shipping_address = data; }, function (error) {
            console.error(error);
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.shipping_address);
            }
        });
    };
    CheckoutComponent.prototype.onChangeAddress = function (value, index) {
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
    };
    CheckoutComponent.prototype.updateShipStatus = function (value, ship_status_string) {
        ship_status_string = value.Address1;
        if (value.Address2 != null) {
            ship_status_string += ', ' + value.Address2;
        }
        if (value.City.length > 0) {
            ship_status_string += ', ' + value.City;
        }
        if (value.State.length > 0) {
            ship_status_string += ', ' + value.State;
        }
        if (value.Zip.length > 0) {
            ship_status_string += ', ' + value.Zip;
        }
        this.ship_status = ship_status_string;
    };
    CheckoutComponent.prototype.onEditShip = function (address, index) {
        this.edit_ship_address = true;
        this.selected_shipping.address = address;
        this.selected_ship_address.option = index;
        this.selected_shipping.index = index;
        this.show_add_address = false;
    };
    CheckoutComponent.prototype.cancelEditShip = function () {
        this.edit_ship_address = false;
        this.getShippingOptions(this.selected_shipping.address);
    };
    CheckoutComponent.prototype.onSaveGuestShipAddress = function (value) {
        var _this = this;
        this.guestShippingAddress.CustId = 0;
        this.guestShippingAddress.ShipToId = 0;
        if (this.is_debug_on) {
            console.log(this.guestShippingAddress);
        }
        this._sa.addShippingAddress(this.guestShippingAddress, this.user_token)
            .subscribe(function (data) {
            _this.guest_shipping_address = data;
        }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
            _this.shipping_form_error = error.json();
            _this.showShippingFormErrors(_this.shipping_form_error.PropertyErrors);
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.guest_shipping_address);
            }
            _this.getShippingOptions(_this.guest_shipping_address.ShippingAddresses[0]);
            _this.guestShippingAddress = _this.guest_shipping_address.ShippingAddresses[0];
            _this.show_guest_address_form = !value;
            _this.updateShipStatus(_this.guest_shipping_address.ShippingAddresses[0], '');
            _this.shipping_form_errors.FName = false;
            _this.shipping_form_errors.LName = false;
            _this.shipping_form_errors.Address1 = false;
            _this.shipping_form_errors.City = false;
            _this.shipping_form_errors.State = false;
            _this.shipping_form_errors.Zip = false;
        });
    };
    CheckoutComponent.prototype.onEditGuestShip = function (value) {
        this.show_guest_edit_address_form = !value;
    };
    CheckoutComponent.prototype.onEditGuestShipAddress = function (value) {
        var _this = this;
        this._sa.editShippingAddress(this.guestShippingAddress, this.user_token)
            .subscribe(function (data) {
            _this.guest_shipping_address = data;
        }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
            _this.shipping_form_error = error.json();
            _this.showShippingFormErrors(_this.shipping_form_error.PropertyErrors);
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.guest_shipping_address);
            }
            _this.getShippingOptions(_this.guest_shipping_address.ShippingAddresses[0]);
            _this.guestShippingAddress = _this.guest_shipping_address.ShippingAddresses[0];
            _this.show_guest_edit_address_form = !value;
            _this.updateShipStatus(_this.guest_shipping_address.ShippingAddresses[0], '');
            _this.shipping_form_errors.FName = false;
            _this.shipping_form_errors.LName = false;
            _this.shipping_form_errors.Address1 = false;
            _this.shipping_form_errors.City = false;
            _this.shipping_form_errors.State = false;
            _this.shipping_form_errors.Zip = false;
        });
    };
    CheckoutComponent.prototype.onSaveEditAddress = function (submitAddress) {
        var _this = this;
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
            .subscribe(function (data) { return _this.shipping_address = data; }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
            _this.shipping_form_error = error.json();
            _this.showShippingFormErrors(_this.shipping_form_error.PropertyErrors);
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.shipping_address);
            }
            _this.edit_ship_address = false;
            _this.selected_ship_address.option = _this.selected_shipping.index;
            _this.updateShipStatus(_this.selected_shipping.address, '');
            _this.getShippingOptions(_this.selected_shipping.address);
            _this.selected_shipping_method = null;
            _this.shipping_method_string = '';
            _this.shipping_form_errors.FName = false;
            _this.shipping_form_errors.LName = false;
            _this.shipping_form_errors.Address1 = false;
            _this.shipping_form_errors.City = false;
            _this.shipping_form_errors.State = false;
            _this.shipping_form_errors.Zip = false;
        });
    };
    CheckoutComponent.prototype.showShippingFormErrors = function (value) {
        for (var i = 0; i < value.length; i++) {
            switch (value[i].Name) {
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
    };
    CheckoutComponent.prototype.showAddAddress = function (value) {
        this.show_add_address = !value;
        this.shipping_form_errors.FName = false;
        this.shipping_form_errors.LName = false;
        this.shipping_form_errors.Address1 = false;
        this.shipping_form_errors.City = false;
        this.shipping_form_errors.State = false;
        this.shipping_form_errors.Zip = false;
        this.edit_ship_address = false;
        if (value) {
            this.selected_shipping.address = this.shipping_address.ShippingAddresses[0];
            this.selected_ship_address.option = 0;
            this.selected_shipping.index = 0;
            this.getShippingOptions(this.selected_shipping.address);
        }
    };
    CheckoutComponent.prototype.onAddShipAddress = function (value, submitAddress, index) {
        var _this = this;
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
            .subscribe(function (data) { return _this.shipping_address = data; }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
            _this.shipping_form_error = error.json();
            _this.showShippingFormErrors(_this.shipping_form_error.PropertyErrors);
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.shipping_address);
            }
            index = 0;
            _this.show_add_address = !value;
            _this.selected_ship_address = { option: index };
            _this.selected_shipping.address = submitAddress;
            _this.shipping_form_errors.FName = false;
            _this.shipping_form_errors.LName = false;
            _this.shipping_form_errors.Phone = false;
            _this.shipping_form_errors.Address1 = false;
            _this.shipping_form_errors.City = false;
            _this.shipping_form_errors.State = false;
            _this.shipping_form_errors.Zip = false;
            _this.onChangeAddress(_this.shipping_address.ShippingAddresses[0], 0);
        });
    };
    CheckoutComponent.prototype.getShippingOptions = function (address) {
        var _this = this;
        this.on_load_ship_methods = true;
        this._sa.getShippingOptions(address)
            .subscribe(function (data) {
            _this.checkout = data;
        }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
            _this.on_load_ship_methods = false;
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.checkout);
            }
            _this.new_shipping_options = _this.checkout.ShippingOptions.ShippingOptionsVisible;
            _this.shipping_options = _this.checkout.ShippingOptions.ShippingOptions;
            _this.setShippingMethodArray(_this.shipping_options);
            _this.on_load_ship_methods = false;
            _this.has_custom_product = _this.checkout.OrderSummary.HasCustomProducts;
            _this.has_customer_product_user = _this.checkout.OrderSummary.HasCustomProductsUserEntered;
        });
    };
    CheckoutComponent.prototype.setShippingMethodArray = function (array) {
        this.shipping_methods = [];
        for (var i = 0; i < array.length; i++) {
            switch (array[i].ServiceCode) {
                case 'STD':
                    array[i].index = i;
                    if (array[i].ServiceName != 'Standard Shipping') {
                        array[i].Name = array[i].ServiceName;
                    }
                    else if (this.has_custom_product) {
                        array[i].Name = 'Standard Shipping';
                    }
                    else {
                        array[i].Name = 'Standard Shipping -';
                    }
                    this.shipping_methods.push(array[i]);
                    break;
                case '02':
                    array[i].index = i;
                    if (this.has_custom_product) {
                        array[i].Name = 'Expedited Shipping';
                    }
                    else {
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
        var fedex_bt = {
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
        if (this.is_debug_on) {
            console.log(this.shipping_methods);
        }
    };
    CheckoutComponent.prototype.onShipChangeMethod = function (idx, option_idx, service_code) {
        var _this = this;
        var row = idx + 1;
        this.row_selected_shipping = {
            RowId: row
        };
        this._sa.setShippingOption(this.row_selected_shipping)
            .subscribe(function (data) {
            _this.checkout = data;
        }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.checkout);
            }
            _this.selected_shipping_method = option_idx;
            if (option_idx === 1) {
                _this.shipping_method_string = _this.shipping_methods[option_idx].Description;
            }
            else {
                _this.shipping_method_string = _this.shipping_methods[option_idx].Name;
            }
            _this.ups_number = '';
            _this.ups_billing_method_string = '';
            _this.fedex_number = '';
            _this.fedex_billing_method_string = '';
            _this.ship_option_service_code = service_code;
            _this.shippingMethodCases(option_idx);
            _this.has_custom_product = _this.checkout.OrderSummary.HasCustomProducts;
            _this.has_customer_product_user = _this.checkout.OrderSummary.HasCustomProductsUserEntered;
        });
    };
    CheckoutComponent.prototype.onBillToSelect = function (idx, option_idx, service_code) {
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
    };
    CheckoutComponent.prototype.onUpsBilling = function (idx, option) {
        var _this = this;
        var row = idx + 1;
        console.log(row);
        this.ups_billing_info.RowId = row;
        this.ups_billing_info.ServiceName = option;
        this.ups_billing_info.ServiceAccount = this.ups_number;
        this._sa.setBillToOption(this.ups_billing_info)
            .subscribe(function (data) {
            _this.checkout = data;
        }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.checkout);
            }
            _this.ups_billing_method_string = option;
            _this.selected_shipping_method = row - 1;
            _this.has_custom_product = _this.checkout.OrderSummary.HasCustomProducts;
            _this.has_customer_product_user = _this.checkout.OrderSummary.HasCustomProductsUserEntered;
        });
    };
    CheckoutComponent.prototype.onFedExBilling = function (idx, option) {
        var _this = this;
        var row = idx + 1;
        console.log(row);
        this.fedex_billing_info.RowId = row;
        this.fedex_billing_info.ServiceName = option;
        this.fedex_billing_info.ServiceAccount = this.fedex_number;
        this._sa.setBillToOption(this.fedex_billing_info)
            .subscribe(function (data) {
            _this.checkout = data;
        }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.checkout);
            }
            _this.fedex_billing_method_string = option;
            _this.selected_shipping_method = row - 1;
            _this.has_custom_product = _this.checkout.OrderSummary.HasCustomProducts;
            _this.has_customer_product_user = _this.checkout.OrderSummary.HasCustomProductsUserEntered;
        });
    };
    CheckoutComponent.prototype.shippingMethodCases = function (option_idx) {
        switch (this.shipping_methods[option_idx].ServiceCode) {
            case 'BT':
                if (this.shipping_methods[option_idx].Name === 'Bill To My UPS Account') {
                    this.show_ups_shipping_acct_field = true;
                    this.show_fedex_shipping_acct_field = false;
                    this.shipping_method_string = 'Bill To My UPS Account';
                }
                else {
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
    };
    CheckoutComponent.prototype.setCouponCode = function (value) {
        if (this.is_debug_on) {
            console.log(value);
        }
        this.coupon_code.EnteredCouponCode = value;
    };
    CheckoutComponent.prototype.applyCouponCode = function () {
        var _this = this;
        console.log(this.coupon_code);
        this._coupon.saveCouponCode(this.coupon_code)
            .subscribe(function (data) {
            _this.checkout = data;
        }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.checkout);
            }
            _this.display_coupon_code = _this.checkout.Coupon.CouponDeleteVisible;
            _this.shipping_options = _this.checkout.ShippingOptions.ShippingOptions;
            _this.setShippingMethodArray(_this.shipping_options);
            _this.selected_shipping_method = null;
            _this.has_custom_product = _this.checkout.OrderSummary.HasCustomProducts;
            _this.has_customer_product_user = _this.checkout.OrderSummary.HasCustomProductsUserEntered;
        });
    };
    CheckoutComponent.prototype.changeCouponCode = function () {
        var _this = this;
        this._coupon.deleteCouponCode()
            .subscribe(function (data) {
            _this.checkout = data;
        }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.checkout);
            }
            _this.display_coupon_code = _this.checkout.Coupon.CouponDeleteVisible;
            _this.shipping_options = _this.checkout.ShippingOptions.ShippingOptions;
            _this.selected_shipping_method = null;
            _this.coupon_code.EnteredCouponCode = '';
            _this.shipping_method_string = '';
            _this.setShippingMethodArray(_this.shipping_options);
            _this.has_custom_product = _this.checkout.OrderSummary.HasCustomProducts;
            _this.has_customer_product_user = _this.checkout.OrderSummary.HasCustomProductsUserEntered;
        });
    };
    CheckoutComponent.prototype.saveShipMethod = function () {
        if (this.checkout.ShippingOptions.ShippingAddress.ShipToId < 1) {
            this.ship_method_error = true;
            this.ship_method_error_string = 'Please Save Your Shipping Address';
            console.log(this.checkout.ShippingOptions.ShippingAddress.ShipToId);
        }
        else {
            switch (this.ship_option_service_code) {
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
                    if (this.checkout.ShippingOptions.SelectedBillToService.ServiceCarrier === 'UPS') {
                        if (!this.ups_number) {
                            this.ship_method_error = true;
                            this.ship_method_error_string = 'Please Enter a UPS Shipping Account';
                        }
                        else if (this.ups_billing_info.ServiceName === '') {
                            this.ship_method_error = true;
                            this.ship_method_error_string = 'Please Select a UPS Shipping Method';
                        }
                        else {
                            this.showShippingPanel = false;
                            this.hideShippingPanel = true;
                            this.shipping_complete = true;
                            this.ship_method_error = false;
                        }
                    }
                    else {
                        if (!this.fedex_number) {
                            this.ship_method_error = true;
                            this.ship_method_error_string = 'Please Enter a FedEx Shipping Account';
                        }
                        else if (this.fedex_billing_info.ServiceName === '') {
                            this.ship_method_error = true;
                            this.ship_method_error_string = 'Please Select a FedEx Shipping Method';
                        }
                        else {
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
        if (this.isGuestCustomerAuth()) {
            this.edit_bill_address = true;
        }
    };
    CheckoutComponent.prototype.onGetBillingAddress = function (token) {
        var _this = this;
        var name = '';
        this._ba.getBillingAddress(token)
            .subscribe(function (data) { return _this.billing_address = data; }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.billing_address);
            }
        });
    };
    CheckoutComponent.prototype.enterPONumber = function (value) {
        this.po_input = value;
    };
    CheckoutComponent.prototype.toggleBillingPanel = function (newState) {
        this.showBillingPanel = newState;
        this.hideBillingPanel = !newState;
        this.showLoginPanel = false;
        this.hideLoginPanel = true;
        this.showShippingPanel = false;
        this.hideShippingPanel = true;
    };
    CheckoutComponent.prototype.onEditBillAddress = function () {
        this.edit_bill_address = true;
    };
    CheckoutComponent.prototype.onSaveBillAddress = function (bill_status_string) {
        var _this = this;
        if (this.same_as_ship.value) {
            bill_status_string = 'Bill to: Same As Shipping';
        }
        else if (!this.same_as_ship.value) {
            bill_status_string = 'Bill to: ' + this.billing_address.Address1;
            if (this.billing_address.Address2.length > 0) {
                bill_status_string += ', ' + this.billing_address.Address2;
            }
            if (this.billing_address.City.length > 0) {
                bill_status_string += ', ' + this.billing_address.City;
            }
            bill_status_string += ', ' + this.billing_address.State;
            bill_status_string += ' ' + this.billing_address.Zip;
        }
        this.bill_status = bill_status_string;
        this._ba.editBillingAddress(this.billing_address, this.user_token)
            .subscribe(function (data) {
            _this.billing_address = data;
        }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
            _this.billing_form_error = error.json();
            _this.edit_bill_address = true;
            _this.showBillingFormErrors(_this.billing_form_error.PropertyErrors);
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.billing_address);
            }
            _this.edit_bill_address = false;
            _this.billing_form_errors.FName = false;
            _this.billing_form_errors.LName = false;
            _this.billing_form_errors.Phone = false;
            _this.billing_form_errors.Address1 = false;
            _this.billing_form_errors.City = false;
            _this.billing_form_errors.State = false;
            _this.billing_form_errors.Zip = false;
        });
    };
    CheckoutComponent.prototype.showBillingFormErrors = function (value) {
        for (var i = 0; i < value.length; i++) {
            switch (value[i].Name) {
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
    };
    CheckoutComponent.prototype.billSameAsShip = function () {
        if (!this.same_as_ship.value) {
            if (this.isReturnCustomerAuth()) {
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
            }
            else {
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
        }
        else {
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
    };
    CheckoutComponent.prototype.onSelectBillMethod = function (value, bill_status_string) {
        this.payment_type = value;
        if (this.same_as_ship.value) {
            bill_status_string = 'Bill to: Same As Shipping';
        }
        else if (!this.same_as_ship.value) {
            bill_status_string = 'Bill to: ' + this.billing_address.Address1;
            if (this.billing_address.Address2.length > 0) {
                bill_status_string += ', ' + this.billing_address.Address2;
            }
            if (this.billing_address.City.length > 0) {
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
    };
    CheckoutComponent.prototype.setPaymentMethod = function () {
        var _this = this;
        if (this.is_debug_on) {
            console.log(this.payment_type);
        }
        this._ba.editBillingAddress(this.billing_address, this.user_token)
            .subscribe(function (data) {
            _this.billing_address = data;
        }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
            _this.billing_form_error = error.json();
            _this.edit_bill_address = true;
            _this.showBillingFormErrors(_this.billing_form_error.PropertyErrors);
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.billing_address);
            }
            _this.edit_bill_address = false;
            if (!_this.payment_type) {
                _this.payment_type_error = true;
                _this.payment_type_error_string = 'Please Select a Payment Type';
            }
            else if (_this.payment_type) {
                _this.payment_type_error = false;
                _this.billing_complete = true;
                _this.hideLoginPanel = true;
                _this.showLoginPanel = false;
                _this.hideShippingPanel = true;
                _this.showShippingPanel = false;
                _this.hideBillingPanel = true;
                _this.showBillingPanel = false;
                _this.showSummary = false;
            }
        });
    };
    CheckoutComponent.prototype.checkComTerms = function () {
        this.isComTermsChecked = !this.isComTermsChecked;
        this.isTermsAndConditionsFinished();
    };
    CheckoutComponent.prototype.checkToU = function () {
        this.isToUChecked = !this.isToUChecked;
        this.isTermsAndConditionsFinished();
    };
    CheckoutComponent.prototype.isTermsAndConditionsFinished = function () {
        if (this.isToUChecked && this.isComTermsChecked) {
            this.show_review_complete_btn = true;
            this.changePaymentHeader();
        }
        else {
            this.show_review_complete_btn = false;
        }
    };
    CheckoutComponent.prototype.comTerms = function () {
        window.open("/info/commercialterms", "Commercial Terms", "menubar=1, resizable=1, width=500, height=500");
    };
    CheckoutComponent.prototype.termsOfUse = function () {
        window.open("/info/termsofuse", "Terms of Use", "menubar=1, resizable=1, width=500, height=500");
    };
    CheckoutComponent.prototype.onRecordOrder = function () {
        var _this = this;
        if (this.checkout.ShippingOptions.ShippingAddress.ShipToId < 1) {
            this.record_order_errors.isOrderError = true;
            this.record_order_errors.Error = 'Order Error';
            this.record_order_errors.Description = 'Please Select or Save A Shipping Address';
        }
        else if (this.selected_shipping_method === null) {
            this.record_order_errors.isOrderError = true;
            this.record_order_errors.Error = 'Order Error';
            this.record_order_errors.Description = 'Please Select A Shipping Method';
        }
        else {
            this.record_order_errors.isOrderError = false;
            this.on_submit_order = true;
            this.review_complete = true;
            this.recordOrderObject.PaymentType = this.payment_type;
            this.recordOrderObject.Notes = this.order_notes;
            this.recordOrderObject.Confirm_TOU = this.isToUChecked;
            this.recordOrderObject.Confirm_TOS = this.isComTermsChecked;
            this.recordOrderObject.PONumber = this.po_input;
            this._sc.recordOrder(this.recordOrderObject, this.user_token)
                .subscribe(function (data) {
                _this.recordOrderResponse = data;
            }, function (error) {
                if (_this.is_debug_on) {
                    console.error(error);
                }
                _this.recordOrderResponse = error.json();
                _this.is_payment_error = true;
                _this.payment_error_object.Error = _this.recordOrderResponse.Error;
                _this.payment_error_object.Description = _this.recordOrderResponse.Message;
                _this.on_submit_order = false;
            }, function () {
                if (_this.is_debug_on) {
                    console.log(_this.recordOrderResponse);
                }
                _this.on_submit_order = false;
                _this.changePaymentHeader();
                loadjs(_this.recordOrderResponse.OrderCompletedScripts);
            });
        }
    };
    CheckoutComponent.prototype.changePaymentHeader = function () {
        switch (this.recordOrderObject.PaymentType) {
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
    };
    CheckoutComponent.prototype.numberChange = function (value) {
        this.stripe_obj.number = value;
        this.onGetStripeToken();
    };
    CheckoutComponent.prototype.cvcChange = function (value) {
        this.stripe_obj.cvc = value;
        this.onGetStripeToken();
    };
    CheckoutComponent.prototype.monthChange = function (value) {
        this.stripe_obj.exp_month = value;
        this.onGetStripeToken();
    };
    CheckoutComponent.prototype.yearChange = function (value) {
        this.stripe_obj.exp_year = value;
        this.onGetStripeToken();
    };
    CheckoutComponent.prototype.onGetStripeToken = function () {
        if (this.is_debug_on) {
            console.log(this.stripe_obj);
        }
        Stripe.card.createToken(this.stripe_obj, this.stripeResponseHandler.bind(this));
    };
    CheckoutComponent.prototype.stripeResponseHandler = function (status, response) {
        var _this = this;
        if (this.is_debug_on) {
            console.log(response);
        }
        if (response.error) {
            setTimeout(function () {
                _this.stripe_error = true;
                _this.stripe_success = false;
                _this.stripe_message = response.error.message;
                _this.stripe_param = response.error.param;
                if (_this.is_debug_on) {
                    console.error(response.error);
                }
                _this.ref.detectChanges();
            }, 500);
        }
        else {
            setTimeout(function () {
                _this.stripe_error = false;
                _this.stripe_success = true;
                _this.stripe_message = 'Approved';
                _this.stripe_check.id = response.id;
                _this.stripe_check.card_type = response.card.brand;
                if (_this.is_debug_on) {
                    console.log(response);
                }
                _this.ref.detectChanges();
            }, 500);
        }
    };
    CheckoutComponent.prototype.getExpYear = function () {
        this.current_year = getCurrentYear();
        for (var i = 0; i <= 20; i++) {
            this.exp_year_array.push(this.current_year.toString());
            this.current_year++;
        }
    };
    CheckoutComponent.prototype.onSubmitStripePayment = function () {
        var _this = this;
        this.on_submit_payment = true;
        this.submit_stripe_data_obj.TransactionId = this.stripe_check.id;
        this.submit_stripe_data_obj.CardBrand = this.stripe_check.card_type;
        this._stripe.submitStripePayment(this.submit_stripe_data_obj, this.user_token)
            .subscribe(function (data) {
            _this.stripe_payment_response = data;
        }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
            _this.payment_error_object = error.json();
            _this.is_payment_error = true;
            _this.on_submit_payment = false;
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.stripe_payment_response);
            }
            _this.on_submit_payment = false;
            _this.on_order_success = true;
            _this.order_confirm_number = _this.stripe_payment_response.OrderDetails.OrderNumber;
            _this.payment_details_header = 'Thank you for your order - Order # ' + _this.stripe_payment_response.OrderDetails.OrderNumber;
            _this.order_confirm_header = _this.stripe_payment_response.Description;
            _this.continue_button_url = _this.stripe_payment_response.DisplayContinueButtonUrl;
            _this.continue_button_text = 'Continue Shopping';
            if (_this.isGuestCustomerAuth()) {
                sessionStorage.removeItem('guest_email');
                sessionStorage.removeItem('token');
            }
            loadjs(_this.stripe_payment_response.OrderCompletedScripts);
        });
    };
    CheckoutComponent.prototype.onBailOutOfStripe = function () {
        var _this = this;
        this._stripe.bailOutOfStripe(this.user_token)
            .subscribe(function (data) {
            _this.stripe_payment_response = data;
        }, function (error) {
            if (_this.is_debug_on) {
                console.error(error);
            }
            _this.payment_error_object = error.json();
            _this.is_payment_error = true;
            _this.on_submit_payment = false;
        }, function () {
            if (_this.is_debug_on) {
                console.log(_this.stripe_payment_response);
            }
            _this.on_order_success = true;
            _this.order_confirm_header = _this.stripe_payment_response.Description;
            _this.continue_button_url = _this.stripe_payment_response.DisplayContinueButtonUrl;
            _this.continue_button_text = 'Continue Shopping';
            if (_this.isGuestCustomerAuth()) {
                sessionStorage.removeItem('guest_email');
                sessionStorage.removeItem('token');
            }
            loadjs(_this.recordOrderResponse.OrderCompletedScripts);
        });
    };
    CheckoutComponent = __decorate([
        core_1.Component({
            selector: 'checkout',
            templateUrl: '/cart/app/checkout/checkout.template.html',
            providers: [checkout_service_1.CheckoutService, auth_service_1.AuthService, shipping_address_service_1.ShippingAddressService, coupon_code_service_1.CouponCodeService, billing_address_service_1.BillingAddressService, stripe_service_1.StripeService],
            pipes: [phone_number_pipe_1.PhoneNumber]
        }), 
        __metadata('design:paramtypes', [checkout_service_1.CheckoutService, auth_service_1.AuthService, common_1.FormBuilder, shipping_address_service_1.ShippingAddressService, coupon_code_service_1.CouponCodeService, core_1.ChangeDetectorRef, billing_address_service_1.BillingAddressService, stripe_service_1.StripeService])
    ], CheckoutComponent);
    return CheckoutComponent;
}());
exports.CheckoutComponent = CheckoutComponent;
function getCurrentYear() {
    var d = new Date();
    var year = d.getFullYear();
    return year;
}
function loginHeader() {
    if (document.getElementById('loginLink')) {
        var loginLink = document.getElementById('loginLink');
        var logoutLink = document.createElement('a');
        var registerLink = document.getElementById('registerLink');
        var myAccountLink = document.createElement('a');
        myAccountLink.href = '/Store/Manage';
        myAccountLink.title = 'Manage';
        myAccountLink.id = 'myAccountLink';
        myAccountLink.innerHTML = 'My Account';
        registerLink.parentNode.replaceChild(myAccountLink, registerLink);
        logoutLink.href = '/Store/Account/LogOut';
        logoutLink.title = 'Log out';
        logoutLink.id = 'logoutLink';
        logoutLink.innerHTML = 'Log Out';
        logoutLink.onclick = function () {
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            localStorage.removeItem('new_user');
            sessionStorage.removeItem('guest_email');
            sessionStorage.removeItem('token');
            logoutLink.parentNode.replaceChild(loginLink, logoutLink);
        };
        loginLink.parentNode.replaceChild(logoutLink, loginLink);
    }
}
function welcomeHeader(value) {
    var c = document.getElementsByClassName('welcome')[0].children.length;
    // console.log(c);
    if (c <= 0) {
        var welcomeClass = document.getElementsByClassName('welcome')[0];
        var welcomeLink = document.createElement('a');
        var welcomeText = 'Welcome ' + value;
        welcomeLink.id = 'welcomeLink';
        welcomeLink.innerHTML = welcomeText;
        welcomeLink.href = '/Store/Manage';
        welcomeClass.appendChild(welcomeLink);
    }
    else {
        var welcomeLink = document.getElementsByClassName('welcome')[0].children[0];
        welcomeLink.id = 'welcomeLink';
        welcomeLink.innerHTML = 'Welcome ' + value;
    }
}
function logoutHeader() {
    if (document.getElementById('logoutLink')) {
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
        loginLink.href = '/Store/Account/Login';
        loginLink.id = 'loginLink';
        loginLink.innerHTML = 'Log In';
        logoutLink.parentNode.replaceChild(loginLink, logoutLink);
    }
}
function ifCurrentUserLogin() {
    if (document.getElementById('logoutLink')) {
        var logoutLink = document.getElementById('logoutLink');
        logoutLink.onclick = function () {
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            localStorage.removeItem('new_user');
            localStorage.removeItem('expires');
            sessionStorage.removeItem('guest_email');
            sessionStorage.removeItem('token');
        };
    }
}
function getStripePubKey() {
    var metas = document.getElementsByTagName('meta');
    for (var i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute("name") == "publishable_key") {
            return metas[i].getAttribute("content");
        }
    }
    return "";
}
function setExpiresToken(value) {
    var d = new Date();
    var current_ms = d.getTime();
    var current = current_ms / 1000;
    var expires = current + value;
    return expires;
}
function loadjs(array) {
    var headtag = document.getElementsByTagName('head');
    if (array != null) {
        for (var j = 0; j < array.length; j++) {
            var scripttag = document.createElement('script');
            var url = array[j].Url;
            scripttag.setAttribute('type', 'text/javascript');
            if (url.length != 0) {
                scripttag.setAttribute('src', url);
            }
            var scr = array[j].Script;
            if (scr.length != 0) {
                scripttag.innerHTML = scr;
            }
            headtag[0].appendChild(scripttag);
        }
    }
}
//# sourceMappingURL=checkout.component.js.map