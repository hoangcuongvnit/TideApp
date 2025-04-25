import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'page',
    standalone   : true,
    templateUrl  : './page.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class PageComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
