import { Component, View, OnInit } from 'angular2/core';
import {CanActivate, RouteParams} from 'angular2/router';
import {LoggerService} from '../../services/logger.service';
import {Chessboard} from '../../integration/chessboardjs/chessboard.component';

@Component({})
@View({
    template: `
        <div>
            Game {{_gameId}} detail
            <chessboard [fen]="_currentPositionFen"></chessboard>
        </div>
    `,
    directives: [Chessboard]
})
@CanActivate((next, prev) => {
    // TODO: Implement when we have DI here to get hold of our authenticationService
    // https://github.com/angular/angular/issues/4112
    // For now it is not much of a problem since we will be hiding the link to this component
    // and the back end won't serve any content anyway
    return true;
})
export class GameDetail implements OnInit {
    private _gameId : string;
    private _currentPositionFen: string = "start";

    constructor (
        private _logger: LoggerService,
        private _routeParams: RouteParams
    ) {}

    ngOnInit() {
        this._gameId = this._routeParams.get('id');

        setTimeout(()=>this._currentPositionFen = "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2", 1000);
        setTimeout(()=>this._currentPositionFen = "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R", 2000);
        setTimeout(()=>this._currentPositionFen = "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2", 3000);
        setTimeout(()=>this._currentPositionFen = "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R", 4000);
        setTimeout(()=>this._currentPositionFen = "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2", 5000);
    }
}
