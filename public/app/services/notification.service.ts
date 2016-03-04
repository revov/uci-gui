import {Injectable} from 'angular2/core';
import 'toastr';

export enum NotificationLevel {
    success,
    info,
    warning,
    error
}

@Injectable()
export class NotificationService {
    constructor() {
        (<any>window).toastr.options.progressBar = true;
        (<any>window).toastr.options.positionClass = "toast-bottom-left";
        (<any>window).toastr.options.showEasing = 'swing';
        (<any>window).toastr.options.hideEasing = 'swing';
        (<any>window).toastr.options.showMethod = 'slideDown';
        (<any>window).toastr.options.hideMethod = 'slideUp';
        (<any>window).toastr.options.timeOut = 10000;
        (<any>window).toastr.options.showDuration = 150;
        (<any>window).toastr.options.hideDuration = 300;
    }

    /**
     * Shows a notification message
     * @param level One of success|info|warning|error
     * @param title The header of the notification message
     * @param message The content of the notification message
     * @param options Any additional toastr options
     */
    public notify( level: NotificationLevel, title: string, message: string = '', options: any = {} ) : void {
        let notificationType: string = '';
        switch (level) {
            case NotificationLevel.success:
                notificationType = 'success';
                break;
            case NotificationLevel.info:
                notificationType = 'info';
                break;
            case NotificationLevel.warning:
                notificationType = 'warning';
                break;
            case NotificationLevel.error:
                notificationType = 'error';
                break;
        }

        (<any>window).toastr[notificationType](title, message, options);
    }
}