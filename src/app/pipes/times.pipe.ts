import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'times',
    standalone: false
})
export class TimesPipe implements PipeTransform {

  transform(value: number): Iterable<number> {
    return {
      [Symbol.iterator]: function* () {
        let n = 0;
        while (n < value) {
          yield ++n;
        }
      },
    };
  }

}
