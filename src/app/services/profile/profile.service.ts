import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { cryptoSecretKey, biometricsUrl} from 'src/app/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  key = CryptoJS.enc.Utf8.parse(cryptoSecretKey);
  initilizationVector:any = CryptoJS.lib.WordArray.random(16);
  encrypted = '';
  constructor() { }

  public encryptJSONPayload(payload: any){
  console.log('payload to encypt>>', payload);
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(payload), this.key, {
      keySize: 128 / 8,
      iv: CryptoJS.enc.Utf8.parse(this.initilizationVector.toString()),
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    this.encrypted = encrypted.toString();
    const base64String = this.encrypted
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
   let biometricsString:string = `${biometricsUrl}?data=${base64String}`;
   window.open(biometricsString, '_blank');
   //window.location.href = biometricsString;
   console.log('url to open>>>',biometricsString);
  }

  public decryptJSONPayload(){
    const decrypted = CryptoJS.AES.decrypt(
      this.encrypted,
      this.key,
      {
        keySize: 128 / 8,
        iv: this.initilizationVector,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    let decodedData = decrypted.toString(CryptoJS.enc.Utf8);
    let parseDecodedData = JSON.parse(decodedData);
   // console.log("decode encrypted data>>", parseDecodedData);
  }

}
