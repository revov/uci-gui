import { Component, View } from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import 'semantic-ui';

import {Home} from './home.component';
import {Login} from './login.component';

@Component({
    selector: 'main-app'
})
@View({
    template: `
        <div class="ui grid">
            <div class="row">
                <div class="ui inverted fixed menu brown navbar page grid">\n\
                    <a [routerLink]="['Home']" class="brand item">UCI GUI</a>
                    <div class="right menu">
                        <a [routerLink]="['Login']" class="item">Login</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="ui page grid main">
            <div class="row">
                <div class="column">
                    <router-outlet></router-outlet>
                </div>
            </div>
        </div>
    `,
    directives: [ROUTER_DIRECTIVES],
    styles: [
        `
            .ui.grid.main{
                margin-top: 70px;
            }
        `
    ]
})
@RouteConfig([
    { path: '/', name: 'Home', component: Home, useAsDefault: true },
    { path: '/login', name: 'Login', component: Login }
])
export class App {
    constructor() {

    }
}
