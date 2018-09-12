'use strict';

export class StringHelper {
    
    static toSafeName(text : string) : string {
        text = text.replace(/[^a-z0-9+]+/gi, '');
        text = text.replace(/^[0-9]*/, '');
        return text;
    }

} 