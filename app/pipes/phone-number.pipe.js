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
var PhoneNumber = (function () {
    function PhoneNumber() {
    }
    PhoneNumber.prototype.transform = function (value) {
        var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (regexObj.test(value)) {
            var parts = value.match(regexObj);
            var phone = '';
            if (parts[1]) {
                phone += "(" + parts[1] + ") ";
            }
            phone += parts[2] + "-" + parts[3];
            return phone;
        }
        else {
            return value;
        }
    };
    PhoneNumber = __decorate([
        core_1.Pipe({
            name: 'phonenumber'
        }), 
        __metadata('design:paramtypes', [])
    ], PhoneNumber);
    return PhoneNumber;
}());
exports.PhoneNumber = PhoneNumber;
//# sourceMappingURL=phone-number.pipe.js.map