import { Component, View } from 'angular2/core';

@Component({})
@View({
    template: `
        <div class="ui one column center aligned grid">
            <div class="column six wide">
                <h2 class="center aligned header">Register</h2>
                <div class="ui form">
                    <div class="field">
                        <div class="ui icon input">
                            <input type="text" placeholder="email" name="password"/>
                            <i class="mail icon"></i>
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui icon input">
                            <input type="password" placeholder="password" name="password"/>
                            <i class="lock icon"></i>
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui icon input">
                            <input type="password" placeholder="repeat password" name="repeatPassword"/>
                            <i class="lock icon"></i>
                        </div>
                    </div>
                    <div class="field">
                        <input type="submit" value="Register" class="ui large fluid brown button">
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Register {
    constructor() {
        
    }
}
