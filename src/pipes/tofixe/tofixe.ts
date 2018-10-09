import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tofixe',
})
export class TofixePipe implements PipeTransform {

  transform(num: number, ...args) {
    if (num == undefined) return 0
    num = Number(num);
    if (num == 0) return 0
    let isPositive = true
    if (num < 0) {
      isPositive = false
      num *= -1
    }
    if (num < 100) {
      if (num < 10) {
        if (num < 1) {
          if (num < 0.01) {
            if (num < 0.001) {
              if (num < 0.0001) {
                if (num < 0.00001) {
                  if (num < 0.000001) {
                    if (num < 0.0000001) {
                      if (num < 0.00000001) {
                        if (num < 0.000000001) {
                          if (num < 0.0000000001) {
                            if (num < 0.00000000001) {
                              if (num < 0.000000000001) {
                                if (num < 0.0000000000001) {
                                  return isPositive ? Number(num.toFixed(14)) : Number(num.toFixed(14)) * -1
                                }
                                return isPositive ? Number(num.toFixed(13)) : Number(num.toFixed(13)) * -1
                              }
                              return isPositive ? Number(num.toFixed(12)) : Number(num.toFixed(12)) * -1
                            }
                            return isPositive ? Number(num.toFixed(11)) : Number(num.toFixed(11)) * -1
                          }
                          return isPositive ? Number(num.toFixed(10)) : Number(num.toFixed(10)) * -1
                        }
                        return isPositive ? Number(num.toFixed(9)) : Number(num.toFixed(9)) * -1
                      }
                      return isPositive ? Number(num.toFixed(8)) : Number(num.toFixed(8)) * -1
                    }
                    return isPositive ? Number(num.toFixed(7)) : Number(num.toFixed(7)) * -1
                  }
                  return isPositive ? Number(num.toFixed(6)) : Number(num.toFixed(6)) * -1
                }
                return isPositive ? Number(num.toFixed(5)) : Number(num.toFixed(5)) * -1
              }
              return isPositive ? Number(num.toFixed(4)) : Number(num.toFixed(4)) * -1
            }
            return isPositive ? Number(num.toFixed(4)) : Number(num.toFixed(4)) * -1
          }
          return isPositive ? Number(num.toFixed(4)) : Number(num.toFixed(4)) * -1
        }
        return isPositive ? Number(num.toFixed(4)) : Number(num.toFixed(4)) * -1
      }
      return isPositive ? Number(num.toFixed(3)) : Number(num.toFixed(3)) * -1
    }
    if (num > 10000) {
      return isPositive ? Number(num.toFixed(1)) : Number(num.toFixed(1)) * -1
    }
    return Number(num.toFixed(2))
  }
}
