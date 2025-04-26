import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'app-files',
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
