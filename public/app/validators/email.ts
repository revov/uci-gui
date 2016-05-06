import { Control } from "@angular/common";

export class Email {

    static validate(control: Control): {[key: string]: any} {
        var regexp = new RegExp("^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$", 'i');

        if (!regexp.test(control.value)) {
            return {invalidEmail: true};
        }

        return null;
    }
}