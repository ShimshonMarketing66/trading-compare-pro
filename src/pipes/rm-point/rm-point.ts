import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the RmPointPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'rmPoint',
})
export class RmPointPipe implements PipeTransform {
  /**
   * Takes a value and remove it point if there.
   */
  transform(value: string, ...args) {
    if (!value) {
      return " "
    }
    return value.split(".")[0];
  }
}
