import { Control } from "angular2/common";

export class Identical {
    
    /**
     * Create a new validate function that will validate value identity against the supplied `control`
     */
    static createValidator(controlToCompareWith: Control) {
        return function validate(control: Control): {[key: string]: any} {
            if( control.value != controlToCompareWith.value ) {
                return {passwordsDoNotMatch: true};
            }

            return null;
        };
    }
}