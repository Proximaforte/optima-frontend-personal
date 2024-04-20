import { Pipe, PipeTransform } from '@angular/core';
import { Beneficiary } from 'src/app/models/beneficiary/beneficiary';

@Pipe({
  name: 'beneficiaryFilter' 
})
export class BeneficiaryFilterPipe implements PipeTransform {

  
  transform(value: Beneficiary[], beneficiaryFilter: string): any {
    if(!!value && beneficiaryFilter !== '') {
      return value.filter((elem: any) => {
        return JSON.stringify(elem)?.toLocaleLowerCase().includes(beneficiaryFilter?.toLocaleLowerCase())
      })
    }else{
      return value;
    }
  }
  //Def 006, 007, 009, 013, 015, 019,024(401 errors)

}
