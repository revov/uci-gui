import { Component, View } from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {
	FormBuilder,
	Validators,
	Control,
	ControlGroup,
	FORM_DIRECTIVES
} from 'angular2/common';
import {AuthenticationService} from '../services/authentication.service';
import {Email} from '../validators/email';
import {Identical} from '../validators/factories/identical';

@Component({})
@View({
    template: `
        <div class="ui one column center aligned grid">
            <div class="column six wide">
                <h2 class="center aligned header">Register</h2>
                <form class="ui form error" [ngFormModel]="form" (ngSubmit)="onRegisterSubmit()">
                    <div class="ui error message" *ngIf="serverError">
                        <div class="header">Registration failed.</div>
                    </div>
                    <div class="field" [ngClass]="{error: (!emailControl.valid && !emailControl.pristine)}">
                        <div class="ui icon input">
                            <input type="text" placeholder="email"  required ngControl="email"/>
                            <i class="mail icon"></i>
                        </div>
                    </div>
                    <div class="field" [ngClass]="{error: (!passwordControl.valid && !passwordControl.pristine)}">
                        <div class="ui icon input">
                            <input type="password" placeholder="password" required ngControl="password"/>
                            <i class="lock icon"></i>
                        </div>
                    </div>
                    <div class="field" [ngClass]="{error: (!passwordRepeatControl.valid && !passwordRepeatControl.pristine)}">
                        <div class="ui icon input">
                            <input type="password" placeholder="repeat password" required ngControl="passwordRepeat"/>
                            <i class="lock icon"></i>
                        </div>
                        <div class="ui float error message" *ngIf="passwordRepeatControl.errors?.passwordsDoNotMatch">
                            Passwords do not match.
                        </div>
                    </div>
                    <div class="field">
                        <input type="submit" value="Register" [disabled]="!form.valid" class="ui large fluid brown button">
                    </div>
                </form>
            </div>
        </div>
    `,
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES]
})
export class Register {
    form: ControlGroup;
    emailControl: Control;
    passwordControl: Control;
    passwordRepeatControl: Control;
    
    serverError: boolean = false;

    constructor (
        private _authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _router: Router
    ) {
        this.emailControl = new Control(
            "", 
            Validators.compose([Validators.required, Email.validate])
        );

        this.passwordControl = new Control(
            '',
            Validators.compose([Validators.required, Validators.minLength(1)])
        );

        this.passwordRepeatControl = new Control(
            '',
            Identical.createValidator(this.passwordControl)
        );

        this.form = _formBuilder.group({
            email: this.emailControl,
            password: this.passwordControl,
            passwordRepeat: this.passwordRepeatControl
        });
    }

    onRegisterSubmit() {
        this._authenticationService.register(this.form.value)
        .subscribe(
            user => { this._router.navigate(['Home'])},
            err => { console.log(err); this.serverError = true; }
        );
    }
}
