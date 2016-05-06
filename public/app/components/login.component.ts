import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';
import {
	FormBuilder,
	Validators,
	Control,
	ControlGroup,
	FORM_DIRECTIVES
} from '@angular/common';
import {AuthenticationService} from '../services/authentication.service';
import {LoggerService} from '../services/logger.service';
import {Email} from '../validators/email';

@Component({
    template: `
        <div class="ui one column center aligned grid">
            <div class="column six wide">
                <h2 class="center aligned header">Log in</h2>
                <form class="ui form error" [ngFormModel]="form" (ngSubmit)="onLoginSubmit()">
                    <div class="ui error message" *ngIf="serverError">
                        <div class="header">Authentication failed.</div>
                        <p>Please check your credentials.</p>
                    </div>
                    <div class="field" [ngClass]="{error: (!emailControl.valid && !emailControl.pristine)}">
                        <div class="ui icon input">
                            <input type="text" placeholder="email" required ngControl="email"/>
                            <i class="mail icon"></i>
                        </div>
                    </div>
                    <div class="field" [ngClass]="{error: (!passwordControl.valid && !passwordControl.pristine)}">
                        <div class="ui icon input">
                            <input type="password" placeholder="password" required ngControl="password"/>
                            <i class="lock icon"></i>
                        </div>
                    </div>
                    <div class="field">
                        <input type="submit" value="Log in" [disabled]="!form.valid" class="ui large fluid brown button">
                    </div>
                    <a [routerLink]="['/Register']">Don't have an account?</a>
                </form>
            </div>
        </div>
    `,
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES]
})
export class Login {
    form: ControlGroup;
    emailControl: Control;
    passwordControl: Control;
    
    serverError: boolean = false;

    constructor (
        private _authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _logger: LoggerService
    ) {
        this.emailControl = new Control(
            "", 
            Validators.compose([Validators.required, Email.validate])
        );

        this.passwordControl = new Control(
            '',
            Validators.compose([Validators.required, Validators.minLength(1)])
        );

        this.form = this._formBuilder.group({
            email: this.emailControl,
            password: this.passwordControl
        });
    }

    onLoginSubmit() {
        this._authenticationService.login(this.form.value)
        .subscribe(
            user => { this._router.navigate(['Games'])},
            err => { this._logger.warn(err); this.serverError = true; }
        );
    }
}
