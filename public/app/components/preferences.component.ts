import { Component } from '@angular/core';
import {
	FormBuilder,
	Validators,
	Control,
	ControlGroup,
	FORM_DIRECTIVES
} from '@angular/common';

import {AuthenticationService} from '../services/authentication.service';
import {NotificationService, NotificationLevel} from '../services/notification.service';

@Component({
    selector: 'preferences-page',
    template: `
        <div class="ui one column aligned grid">
            <div class="column">
                <form class="ui form error" [ngFormModel]="form" (ngSubmit)="savePreferences()">
                    <div class="ui error message" *ngIf="serverError">
                        <div class="header">Error saving preferences.</div>
                    </div>
                    <div class="field" [ngClass]="{error: (!msPerMoveControl.valid && !msPerMoveControl.pristine)}">
                        <label>Milliseconds per move</label>
                        <div class="ui icon input">
                            <input type="text" placeholder="miliseconds" required ngControl="msPerMove"/>
                            <i class="wait icon"></i>
                        </div>
                    </div>
                    <div class="field">
                        <input type="submit" value="Save" [disabled]="!form.valid" class="ui large fluid brown button">
                    </div>
                </form>
            </div>
        </div>
    `,
    directives: [FORM_DIRECTIVES]
})
export class Preferences {
    form: ControlGroup;
    msPerMoveControl: Control;
    
    constructor(
        private _authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _notificationService: NotificationService
    ) {
        this.msPerMoveControl = new Control(
            "0", 
            Validators.pattern('\\d+')
        );

        this.form = _formBuilder.group({
            msPerMove: this.msPerMoveControl
        });
        
        this._authenticationService.currentUser.subscribe(user => {
            if(!user) {return;}
            this.msPerMoveControl.updateValue(user.preferences.uci.msPerMove);
        });
    }
    
    savePreferences(): void {
        this._authenticationService.savePreferences({
            uci: this.form.value
        })
        .subscribe(
            user => this._notificationService.notify(NotificationLevel.success, 'Saved successfully.'),
            err => this._notificationService.notify(NotificationLevel.error, err.message)
        );
    }
}
