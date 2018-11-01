import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstCap',
})
export class FirstCapPipe implements PipeTransform {

  transform(value: string, ...args) {
    console.log(value);
    
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
