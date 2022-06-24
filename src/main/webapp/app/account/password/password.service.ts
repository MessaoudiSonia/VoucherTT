import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { LocalStorageService, SessionStorage, SessionStorageService } from 'ngx-webstorage';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
    private $sessionStorage: SessionStorageService
  ) {}

  save(newPassword: string, currentPassword: string): Observable<{}> {
    const idToken: string = sessionStorage.getItem('token')!;
    const headers_object = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    });
    const httpOptions = {
      headers: headers_object,
    };

    return this.http.post(
      this.applicationConfigService.getEndpointFor('api/account/change-password'),
      { currentPassword, newPassword },
      httpOptions
    );
  }

  saveAgent(newPassword: string, currentPassword: string): Observable<{}> {
    const idToken: string = sessionStorage.getItem('token')!;
    const headers_object = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    });
    const httpOptions = {
      headers: headers_object,
    };

    return this.http.post(
      this.applicationConfigService.getEndpointFor('api/account/change-password-agent'),
      { currentPassword, newPassword },
      httpOptions
    );
  }
}
