import { Component } from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'login-page',
    template: `
        <div class="ui large message">
            <h1 class="ui huge header">Web Platform for Chess Analysis</h1>

            <p>This is a project that aims to provide a Web GUI for UCI engines.</p>
            <p>You want to try it out? Login with an existing account or register a new user.</p>
            <br><br><br><br><br><br><br><br><br><br>
            <a [routerLink]="['Login']" class="ui brown button">Login »</a>
        </div>
    `,
    directives: [ROUTER_DIRECTIVES]
})
export class Home {
    constructor() {
        
    }
}
