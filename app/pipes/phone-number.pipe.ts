import {Pipe} from '@angular/core';

@Pipe({
    name: 'phonenumber'
})
export class PhoneNumber {
    transform(value){
        var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
        if(regexObj.test(value)){
            var parts = value.match(regexObj);
            var phone = '';
            if (parts[1]) { phone += "(" + parts[1] + ") "; }
            phone += parts[2] + "-" + parts[3];
            return phone;
        } else {
            return value;
        }
    }
}