import {Directive, ElementRef} from 'angular2/core';
import 'semantic-ui';

@Directive({
    selector: '[focusableSegment]',
      host: {
        '(focus)': 'onFocus()',
        '(blur)': 'onBlur()'
    }
})
export class FocusableSegmentDirective {
    private element : any;

    constructor( el: ElementRef ) {
        this.element = el.nativeElement;
        this.element.tabIndex = 0;
    }

    onFocus() {
        this.element.classList.add("raised");
    }

    onBlur() {
        this.element.classList.remove("raised");
    }
}
