import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(value: string, ...args) {
   if (value == null) {
     return "not-set"
   }
   let index = value.indexOf('T');
    return value.slice(0, index)
  }
}
