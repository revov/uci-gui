import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {LoggerService} from '../logger.service';
import {Observable} from 'rxjs/Observable';
import {Game} from '../../models/game';

@Injectable()
export class GamesService {
    private _gamesUrl = 'api/games';
    
    private _requestOptions: RequestOptions;

    constructor (
        private _http: Http,
        private _logger: LoggerService
    ) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        this._requestOptions = new RequestOptions({ headers: headers });
    }

    get(gameId: string): Observable<Game> {
        return this._http.get(this._gamesUrl + '/' + gameId, this._requestOptions)
                        .map(res => <Game>res.json());
    }

    getAll() : Observable<Game[]> {
        return this._http.get(this._gamesUrl, this._requestOptions)
                        .map(res => <Game[]>res.json());
    }
    
    delete(gameId: string) : Observable<boolean> {
        return this._http.delete(this._gamesUrl + '/' + gameId, this._requestOptions)
                        .map(res => true);
    }
}