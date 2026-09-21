import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthHeaderService {
  private getAgentData(): string | null {
    return localStorage.getItem('user');
  }

  get customNoAuthHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      accept: '*/*',
    });
  }

  get customHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      accept: '*/*',
      Authorization: `Bearer ${this.getAgentData() ?? ''}`,
    });
  }

  get customDecryptHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'text/plain; charset=utf-8',
      accept: 'text/plain; charset=utf-8',
      Authorization: `Bearer ${this.getAgentData() ?? ''}`,
    });
  }

  get customHttpHeadersNoBearer(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      accept: '*/*',
      Authorization: this.getAgentData() ?? '',
    });
  }

  get customFormDataHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      accept: '*/*',
      Authorization: `Bearer ${this.getAgentData() ?? ''}`,
    });
  }
}
