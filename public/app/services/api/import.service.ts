import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {LoggerService} from '../logger.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ImportService {
    private _importUrl = 'api/import';
    
    private _requestOptions: RequestOptions;

    constructor (
        private _http: Http,
        private _logger: LoggerService
    ) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        this._requestOptions = new RequestOptions({ headers: headers });
    }

    uploadPgn( pgn : string ) : Observable<boolean> {
        let body = JSON.stringify({
            pgnContent: pgn
        });

        return this._http.post(this._importUrl, body, this._requestOptions)
                        .map(res => true);
    }
}