import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {LoggerService} from '../logger.service';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/observable/from';
import {Game} from '../../models/game';

import io from 'socket.io-client';

@Injectable()
export class GamesService {
    private _gamesUrl = 'api/games';
    
    private _requestOptions: RequestOptions;
    private _socket;

    constructor (
        private _http: Http,
        private _logger: LoggerService
    ) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        this._requestOptions = new RequestOptions({ headers: headers });
        this._socket = io(window.location.origin + '/game');
    }

    get(gameId: string): Observable<Game> {
        return this._http.get(this._gamesUrl + '/' + gameId, this._requestOptions)
                        .map(res => <Game>res.json());
    }

    /**
     * Gets all the games as Observables, because each game will report its analysis progres through websockets
     */
    getAll() : Observable<Observable<Game>[]> {
        return this._http.get(this._gamesUrl, this._requestOptions)
                        .map(res => {
                            let games = <Game[]>res.json();
                            let gamesObservables: Observable<Game>[] = [];
                            
                            for(let i = 0; i<games.length; i++) {
                                if(games[i].analysis.status === 'Complete') {
                                    gamesObservables.push(Observable.from([games[i]]));
                                } else {
                                    gamesObservables.push(this.gameProgress(games[i]));
                                }
                            }
                            
                            return gamesObservables;
                        });
    }
    
    delete(gameId: string) : Observable<boolean> {
        return this._http.delete(this._gamesUrl + '/' + gameId, this._requestOptions)
                        .map(res => true);
    }
    
    gameProgress(game: Game): Observable<Game> {
        return new Observable<Game>((gameProgressObserver: Observer<Game>) => {
            this._socket.emit('subscribe', game._id);
            
            let onProgressHandler = function(payload:{status: string, progress: number}) {
                // TODO: should clone this instead of mutating it:
                game.analysis.status = payload.status;
                game.analysis.progress = payload.progress;

                gameProgressObserver.next(game);
                
                if(status === 'Complete') {
                    gameProgressObserver.complete();
                    cleanupHandler();
                }
            }.bind(this);
            
            let cleanupHandler = function() {
                this._socket.emit('unsubscribe', game._id);
                this._socket.off('progress', onProgressHandler);
            }.bind(this);

            this._socket.on('progress', onProgressHandler);
            
            // Return unsubscribe function
            return function() {
                this._logger.debug('unsubscribing from ' + game._id);

                this._socket.emit('unsubscribe', game._id);
                this._socket.off('progress', onProgressHandler);
            }.bind(this);
        });
    }
}
