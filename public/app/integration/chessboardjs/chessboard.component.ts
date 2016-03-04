import { Component, View, Input, AfterViewInit, OnDestroy } from 'angular2/core';
import {LoggerService} from '../../services/logger.service';
import 'oakmac/chessboardjs';

@Component({
    selector: 'chessboard'
})
@View({
    template: `
        <div id="{{_unique_id}}" style="width: 400px"></div>
    `
})
export class Chessboard implements AfterViewInit, OnDestroy {
    private _fen : string;
    @Input()
    set fen(fen: string) {
        this._fen = fen;
        if(this._board) {
            this._board.position(fen);
        }
    }
    
    get fen() { return this._fen }

    private _unique_id : string = 'board' + (new Date()).getTime();
    private _board: any;

    constructor (private _logger: LoggerService) {}

    ngAfterViewInit () {
        this._board = (<any>window).ChessBoard(this._unique_id, {
            // Override the default img path to comply with JSPM
            pieceTheme: 'public/jspm_packages/github/oakmac/chessboardjs@master/img/chesspieces/wikipedia/{piece}.png',
            position: this.fen
        });
    }
    
    ngOnDestroy() {
        this._logger.debug('Destroying the chessboard.');
        this._board.destroy();
        this._board = null;
    }
}