import { Pipe, PipeTransform } from '@angular/core';
import { IncompleteBeneficiary } from 'src/app/models/beneficiary/beneficiary';

@Pipe({
  name: 'incomplete'
})
export class IncompletePipe implements PipeTransform {

  transform(value: IncompleteBeneficiary[], incomplete: string): any {
    if(!!value && incomplete !== '') {
      return value.filter((elem: any) => {
        return JSON.stringify(elem)?.toLocaleLowerCase().includes(incomplete?.toLocaleLowerCase())
      })
    } else {
      return value;
    }
  }

}
