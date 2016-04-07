import { Component, Input, Output, EventEmitter } from 'angular2/core';
import {FocusableSegmentDirective} from '../../integration/semantic/focusableSegment.directive';

@Component({
    selector: 'moves-browser',
    template: `
        <div focusableSegment class="ui segment" (keydown)="onKeyPressed($event.keyCode)">
            <div class="ui horizontal list">
                <div *ngFor="#move of _moves; #i=index" class="item">
                    <span class="move-number">{{i+1}}.</span>
                    <span class="white move" [class.active]="_selectedMoveIndex == (2 * i)" (click)="makeMove(2 * i)">
                        {{move.white}}
                    </span>
                    <span *ngIf="move?.black" class="black move" [class.active]="_selectedMoveIndex == (2 * i + 1)" (click)="makeMove(2 * i + 1)">
                        {{move?.black}}
                    </span>
                </div>
            </div>
        </div>
    `,
    directives: [FocusableSegmentDirective],
    styles: [`
        span.move-number {
            font-weight: bold;
        }

        .move {
            cursor: pointer;
            background: transparent;
            padding: 0.5em 0.5em;
            margin: 0em;
            border-radius: 0.5em;
        }

        .move:hover {
            background: rgba(0, 0, 0, 0.03);
            color: rgba(0, 0, 0, 0.8);\n\
            font-weight: bold;
        }

        .move.active {
            font-weight: bold;
        }

        .white.move.active {
            background: #f0d9b5;
        }

        .black.move.active {
            background: #b58863;
            color: white;
        }

        .ui.segment {
            height: 100%;
            overflow: auto;

            -webkit-touch-callout: none; /* iOS Safari */
            -webkit-user-select: none;   /* Chrome/Safari/Opera */
            -khtml-user-select: none;    /* Konqueror */
            -moz-user-select: none;      /* Firefox */
            -ms-user-select: none;       /* IE/Edge */
            user-select: none;           /* non-prefixed version, currently not supported by any browser */
        }

        .ui.horizontal.list > .item {
            margin-left: 0.5em !important;
            line-height: 1.67em;
        }
    `]
})
export class MovesBrowser {
    private _moves: {white: string, black: string}[];
    private _selectedMoveIndex: number = -1;

    private _halfMoves : any[];
    @Input()
    set halfMoves(halfMoves: any[]) {
        this._halfMoves = halfMoves;
        this._moves = [];

        for (let i = 0; i < halfMoves.length; i+=2) {
            this._moves.push({
                white: halfMoves[i],
                black: halfMoves[i+1] // Maybe there, maybe not
            });
        }
    }
    get halfMoves() { return this._halfMoves }

    @Output() moveSelected = new EventEmitter<number>();
    
    makeMove(index: number) {
        if (index >= this.halfMoves.length || index < -1) {
            return;
        }

        this.moveSelected.emit(index);
        this._selectedMoveIndex = index;
    }

    onKeyPressed(keyCode: number) {
        if(keyCode == 37 /* left */ || keyCode == 38 /* up */) {
            this.makeMove(this._selectedMoveIndex - 1);
            return;
        }
        
        if(keyCode == 39 /* right */ || keyCode == 40 /* down */ || keyCode == 32 /* space */) {
            this.makeMove(this._selectedMoveIndex + 1);
            return;
        }
    }
}
