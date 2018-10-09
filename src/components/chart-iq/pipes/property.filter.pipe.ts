import {Pipe} from '@angular/core';

@Pipe({name: 'filterByPropertyPipe'})
export class FilterByPropertyPipe {
  transform(value, filters) {
    var filter = function(obj, filters) {
      return Object.keys(filters).every(prop => obj[prop] === filters[prop])
    };
    return value.filter(obj => filter(obj, filters.type));
  }
}
