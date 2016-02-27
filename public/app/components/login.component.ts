import { Component, View } from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {AuthenticationService} from '../services/authentication.service';
import {User} from '../models/user';

@Component({})
@View({
    template: `
        <div class="ui one column center aligned grid">
            <div class="column six wide">
                <h2 class="center aligned header">Log in</h2>
                <div class="ui form">
                    <div class="field">
                        <div class="ui icon input">
                            <input type="text" placeholder="email" name="email" [(ngModel)]="model.email"/>
                            <i class="mail icon"></i>
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui icon input">
                            <input type="password" placeholder="password" name="password" [(ngModel)]="model.password"/>
                            <i class="lock icon"></i>
                        </div>
                    </div>
                    <div class="field">
                        <input type="submit" value="Log in" class="ui large fluid brown button" (click)="onLoginSubmit()">
                    </div>
                    <div class="field">
                        <div [routerLink]="['/Register']" class="ui large fluid gray button">Don't have an account?</div>
                    </div>
                </div>
            </div>
        </div>
    `,
    directives: [ROUTER_DIRECTIVES]
})
export class Login {
    model = new User(null, '', '');

    constructor (private _authenticationService: AuthenticationService) {}

    onLoginSubmit() {
        this._authenticationService.login({
            email: this.model.email,
            password: this.model.password
        })
        .subscribe(
            user => console.log(user),
            err => console.log(err)
        );
    }
}
