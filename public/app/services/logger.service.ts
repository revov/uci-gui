import {Injectable} from 'angular2/core';

export enum LogLevel {
    trace,
    debug,
    info,
    warn,
    error,
    silent
}

@Injectable()
export class LoggerService {
    private _logLevel: LogLevel = LogLevel.trace;

    public setLevel(logLevel : LogLevel) {
        this._logLevel = logLevel;
    }

    public trace(msg: any) {
        if (this._logLevel <= LogLevel.trace ) {
            console.trace(msg);
        }
    }
    
    public debug(msg: any) {
        if (this._logLevel <= LogLevel.debug ) {
            console.log(msg);
        }
    }

    public info(msg: any) {
        if (this._logLevel <= LogLevel.info ) {
            console.info(msg);
        }
    }
    
    public warn(msg: any) {
        if (this._logLevel <= LogLevel.warn ) {
            console.warn(msg);
        }
    }

    public error(msg: any) {
        if (this._logLevel <= LogLevel.error ) {
            console.error(msg);
        }
    }
}