import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'auth-confirmation-required',
    templateUrl: './confirmation-required.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    imports: [RouterLink, TranslocoModule],
})
export class AuthConfirmationRequiredComponent {
    /**
     * Constructor
     */
    constructor() {}
}
