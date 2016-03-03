import {Subject} from 'rxjs/Subject';

export class ModalControl {
    private _modalShownSource = new Subject<any>();
    private _modalHiddenSource = new Subject<any>();

    /**
     * Observable that emits when {@link show} is invoked
     */
    public modalShown$ = this._modalShownSource.asObservable();

    /**
     * Observable that emits when {@link hide} is invoked
     */
    public modalHidden$ = this._modalHiddenSource.asObservable();
    
    /**
     * The semantic ui configuration for the modal component
     */
    public configuration : any /*TODO: strongly type this*/;

    constructor( configuration : any ) {
        this.configuration = configuration;
        // We should mark the modal as detachable to prevent Semantic from moving it
        // around the DOM and causing memory leaks
        this.configuration.detachable = false;
    }

    /*
     * Shows the modal.
     */
    public show() : void {
        this._modalShownSource.next(null);
    }
    
    /*
     * Hides the modal.
     */
    public hide() : void {
        this._modalHiddenSource.next(null);
    }
}