import {Pipe} from 'angular2/core';
import {Injectable} from "angular2/core";

@Pipe({name: 'unicodeToDate'})
@Injectable()
export class UnicodeToDatePipe {
    transform(value:string, args:string[]) : any {
        return new Date(value);
    }
}
