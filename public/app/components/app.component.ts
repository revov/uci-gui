import { Component, OnDestroy  } from '@angular/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Subscription}   from 'rxjs/Subscription';
import 'semantic-ui';

import {Home} from './home.component';
import {Login} from './login.component';
import {Register} from './register.component';
import {Games} from './games/games.component';

import {User} from '../models/user';

import {AuthenticationService} from '../services/authentication.service';
import {NotificationService} from '../services/notification.service';
import {LoggerService, LogLevel} from '../services/logger.service';

@Component({
    selector: 'main-app',
    providers: [AuthenticationService, LoggerService, NotificationService],
    template: `
        <div class="ui fixed menu brown navbar grid">
            <div class="ui container">
                <a [routerLink]="['Home']" class="header item" [class.active]="_router.isRouteActive(_router.generate(['Home']))">
                    <i class="home icon"></i>UCI GUI
                </a>
                <a [routerLink]="['Games']" *ngIf="_currentUser" class="item" [class.active]="_router.isRouteActive(_router.generate(['Games']))">
                    <i class="bar chart icon"></i>
                    Games
                </a>
                <div class="right menu">
                    <a [routerLink]="['Login']" class="item" *ngIf="!_currentUser" [class.active]="_router.isRouteActive(_router.generate(['Login']))">
                        <i class="sign in icon"></i>
                        Log in
                    </a>
                    <a class="item" *ngIf="_currentUser" (click)="onLogoutClick()">
                        <i class="sign out icon"></i>
                        {{_currentUser.email}}
                    </a>
                </div>
            </div>
        </div>
        <div></div><!-- Empty div to keep the fixed menu away from the master viewport. Otherwise the document body gets displaced for some odd reason -->
        <div class="ui doubling stackable grid container master-viewport">
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
            .ui.grid.master-viewport{
                padding-top: 70px;
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
        private _router: Router,
        private _logger: LoggerService
    ) {
        if( (<any>window).isProductionEnvironment ) {
            this._logger.setLevel(LogLevel.error);
        }

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
