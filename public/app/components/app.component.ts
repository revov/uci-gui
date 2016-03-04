import { Component, View, OnDestroy  } from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {Subscription}   from 'rxjs/Subscription';
import 'semantic-ui';

import {Home} from './home.component';
import {Login} from './login.component';
import {Register} from './register.component';
import {Games} from './games/games.component';

import {User} from '../models/user';

import {AuthenticationService} from '../services/authentication.service';
import {NotificationService} from '../services/notification.service';
import {LoggerService} from '../services/logger.service';

@Component({
    selector: 'main-app',
    providers: [AuthenticationService, LoggerService, NotificationService]
})
@View({
    template: `
        <div class="ui grid">
            <div class="row">
                <div class="ui inverted fixed menu brown navbar page grid">
                    <a [routerLink]="['Home']" class="header item" [class.active]="_router.isRouteActive(_router.generate(['Home']))">UCI GUI</a>
                    <a [routerLink]="['Games']" *ngIf="_currentUser" class="item" [class.active]="_router.isRouteActive(_router.generate(['Games']))">
                        Games
                    </a>
                    <div class="right menu">
                        <a [routerLink]="['Login']" class="item" *ngIf="!_currentUser" [class.active]="_router.isRouteActive(_router.generate(['Games']))">
                            Log in
                        </a>
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
    { path: '/register', name: 'Register', component: Register },
    { path: '/games/...', name: 'Games', component: Games }
])
export class App implements OnDestroy {
    private _currentUser: User = null;
    private _subscriptionsToDispose : Subscription[] = [];

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
        this._subscriptionsToDispose.forEach(subscription => subscription.unsubscribe());
    }
}
