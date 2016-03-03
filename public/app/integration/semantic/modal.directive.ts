import {Directive, ElementRef, Input, OnInit, OnDestroy} from 'angular2/core';
import {ModalControl} from './controls/modalControl';
import {Subscription}   from 'rxjs/Subscription';
import 'semantic-ui';

@Directive({
    selector: '[semanticModal]'
})
export class ModalDirective implements OnInit, OnDestroy {
    @Input('semanticModal') modalControl : ModalControl;

    private $element : any;
    private _modalShownSubscription : Subscription;
    private _modalHiddenSubscription : Subscription;

    constructor( el: ElementRef ) {
        this.$element = $( el.nativeElement );
    }

    ngOnInit() {
        this.$element.modal(this.modalControl.configuration);

        this._modalShownSubscription = this.modalControl.modalShown$
            .subscribe(() => {
                this.$element.modal('show');
            });
        this._modalHiddenSubscription = this.modalControl.modalHidden$
            .subscribe(() => {
                this.$element.modal('hide');
            });
    }

    ngOnDestroy() {
        this.$element.modal('destroy');
        this._modalShownSubscription.unsubscribe();
        this._modalHiddenSubscription.unsubscribe();
    }
}
