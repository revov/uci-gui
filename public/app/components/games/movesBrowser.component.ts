import { Component, View, Input, Output, EventEmitter } from 'angular2/core';

@Component({
    selector: 'moves-browser'
})
@View({
    template: `
        <div class="ui horizontal list">
            <div *ngFor="#move of _getColumnsCountAsIterable(); #column = index" class="item">
                <table class="ui small striped celled collapsing compact definition table">
                    <tbody>
                        <tr *ngFor="#move of _getRangeOfMoves(column); #i=index">
                            <td>{{(column * 10 + i)+1}}</td>
                            <td class="selectable" [class.active]="_selectedMoveIndex == (2 * (column * 10 + i))" (click)="onMoveClicked(2 * (column * 10 + i))">
                                <a>{{move.white}}</a>
                            </td>
                            <td [class.selectable]="move.black" [class.active]="_selectedMoveIndex == (2 * (column * 10 + i) + 1)" (click)="onMoveClicked(2 * (column * 10 + i) + 1)">
                                <a>{{move?.black}}</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    styles: [`
        tbody td.selectable {
            cursor: pointer; cursor: hand;
        }

        .ui.horizontal.list>.item {
            vertical-align: top;
            margin-left: 0em !important;
            margin-right: 1em !important;
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
    
    onMoveClicked(index: number) {
        if (index >= this.halfMoves.length) {
            // This case happens when the last move in the game is white's and
            // the user clicked on the empty field for the black's move
            return;
        }

        this.moveSelected.emit(index);
        this._selectedMoveIndex = index;
    }
    
    private _getColumnsCountAsIterable(): any[] {
        return new Array(Math.ceil(this._moves.length / 10));
    }
    
    private _getRangeOfMoves(columnIndex: number): {white: string, black: string}[] {
        return this._moves.slice(columnIndex * 10, (columnIndex + 1) * 10);
    }
}
