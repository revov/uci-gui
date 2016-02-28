import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {User} from '../models/user';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
    private _loginUrl = 'api/login';
    private _logoutUrl = 'api/logout';
    private _registerUrl = 'api/register';
    private _userUrl = 'api/user';
    
    private _requestOptions: RequestOptions;
    private _userObserver: Observer<User>;
    
    public currentUser: Observable<User>;

    constructor (private http: Http) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        this._requestOptions = new RequestOptions({ headers: headers });

        this.currentUser = Observable.create(observer => {
            this._userObserver = observer;

            this.http.get(this._userUrl, this._requestOptions)
                        .map(res => <User> res.json())
                        .subscribe(
                            user => this._userObserver.next(user),
                            err => console.log('No user logged in.')
                        );
        });
        
        this.currentUser.subscribe(user => {
            if(user) {
                console.log('User logged in:');
                console.log(user);
            } else {
                console.log('User logged out.');
            }
        });
    }

    login ( loginData : {} ) : Observable<User> {
        let body = JSON.stringify(loginData);

        let httpResult: Observable<User> = this.http.post(this._loginUrl, body, this._requestOptions)
                        .map(res => <User> res.json());

        httpResult.subscribe(user => this._userObserver.next(user));

        return httpResult;
    }

    logout () : Observable<boolean> {
        let httpResult: Observable<boolean> = this.http.post(this._logoutUrl, '', this._requestOptions)
                        .map(res => true);

        httpResult.subscribe(() => this._userObserver.next(null));

        return httpResult;
    }

    register ( registrationData : {} ) : Observable<User> {
        let body = JSON.stringify(registrationData);
        
        let httpResult: Observable<User> = this.http.post(this._registerUrl, body, this._requestOptions)
                        .map(res => <User> res.json());

        httpResult.subscribe(user => this._userObserver.next(user));

        return httpResult;
    }

    getLoggedInUser() : Observable<User> {
        return this.http.post(this._userUrl, '', this._requestOptions)
                        .map(res => <User> res.json());
    }
}