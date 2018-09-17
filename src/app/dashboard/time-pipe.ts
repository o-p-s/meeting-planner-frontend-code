import {Pipe , PipeTransform} from '@angular/core';
@Pipe({
    name:'time'
})
export class TimePipe implements PipeTransform{
    transform(value:string):string{
        return value.toString().substring(0,value.toString().indexOf('GMT'));
    }
}