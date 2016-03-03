import {Component, View, Output, EventEmitter} from 'angular2/core';
import {LoggerService} from '../../services/logger.service';
import {ModalDirective} from '../../integration/semantic/modal.directive';
import {ModalControl} from '../../integration/semantic/controls/modalControl';

@Component({
    selector: 'import-pgn'
})
@View({
    template: `
        <div>
            <button class="ui compact labeled icon button" (click)="onClick()">
                <i class="bar chart icon"></i>
                Import
            </button>

            <div [semanticModal]="_modalControl" class="ui modal">
                <div class="header">
                    Paste PGN
                </div>
                <div class="content">
                    <form class="ui form">
                        <div class="field">
                            <textarea [(ngModel)]="_pgnToUpload" rows="20"></textarea>
                        </div>
                    </form>
                </div>
                <div class="actions">
                    <div class="ui deny button">Cancel</div>
                    <div class="ui approve button">OK</div>
                </div>
            </div>
        </div>
    `,
    directives: [ModalDirective]
})
export class ImportPgn {
    private _pgnToUpload : String;
    private _modalControl : ModalControl;
    
    @Output() onImport = new EventEmitter<String>();

    constructor( private _logger: LoggerService ) {
        this._modalControl = new ModalControl({
            autofocus: true,
            onApprove: ($element) => {
                this.onImport.emit(this._pgnToUpload);
                this._pgnToUpload = '';
            }
        });
    }

    onClick() {
        this._modalControl.show();
    }
}
