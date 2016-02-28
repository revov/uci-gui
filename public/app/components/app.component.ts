import { Component, View, OnDestroy  } from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import 'semantic-ui';

import {Home} from './home.component';
import {Login} from './login.component';
import {Register} from './register.component';

import {User} from '../models/user';

import {AuthenticationService} from '../services/authentication.service';
import {LoggerService} from '../services/logger.service';

@Component({
    selector: 'main-app',
    providers: [AuthenticationService, LoggerService]
})
@View({
    template: `
        <div class="ui grid">
            <div class="row">
                <div class="ui inverted fixed menu brown navbar page grid">\n\
                    <a [routerLink]="['Home']" class="brand item">UCI GUI</a>
                    <div class="right menu">
                        <a [routerLink]="['Login']" class="item" *ngIf="!_currentUser">Log in</a>\n\
                        <a class="item" *ngIf="_currentUser" (click)="onLogoutClick()">{{_currentUser.email}} (Log out)</a>
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
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register }
])
export class App implements OnDestroy {
    private _currentUser: User = null;
    private _subscriptionsToDispose : any[] = [];

    constructor(
        private _authenticationService: AuthenticationService,
        private _router: Router
    ) {
        this._subscriptionsToDispose.push(
            _authenticationService.currentUser.subscribe(user => {
                this._currentUser = user;
            })
        );
    }

    onLogoutClick() {
        this._authenticationService.logout()
            .subscribe();
        this._router.navigate(['Home']);
    }

    ngOnDestroy() {
        this._subscriptionsToDispose.forEach(callback => callback());
    }
}
