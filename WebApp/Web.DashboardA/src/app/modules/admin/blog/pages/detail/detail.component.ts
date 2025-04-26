import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'app-page-detail',
    standalone   : true,
    templateUrl  : './detail.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class DetailComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
