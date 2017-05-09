import { Component } from '@angular/core';
import {CheckoutComponent} from "./checkout/checkout.component";

@Component({
    selector: 'checkout-app',
    template: `
<checkout></checkout>
`,
    directives: [CheckoutComponent]
})
export class AppComponent {}