import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'app-pages',
    standalone   : true,
    templateUrl  : './list.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ListComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
