import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'tag',
    standalone   : true,
    templateUrl  : './tag.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class TagComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
