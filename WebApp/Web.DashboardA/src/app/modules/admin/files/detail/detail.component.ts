import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'app-file-detail',
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
