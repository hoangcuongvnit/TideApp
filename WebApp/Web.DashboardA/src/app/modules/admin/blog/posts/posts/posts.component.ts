import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'posts',
    standalone   : true,
    templateUrl  : './posts.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class PostsComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
