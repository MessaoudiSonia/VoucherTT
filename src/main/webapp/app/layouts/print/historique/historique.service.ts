import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { Document } from 'app/entities/document/document.model';
import { Historique } from 'app/layouts/print/historique/historique.model';
import { DocumentCriteria } from 'app/entities/document/document.criteria';
import { HistoriqueCriteria } from 'app/layouts/print/historique/historique.criteria';

@Injectable({
  providedIn: 'root',
})
export class HistoriqueService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/historique');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}
  findAll(): Observable<Historique[]> {
    return this.http.get<Historique[]>(this.resourceUrl + '/byPoste');
  }
  findAllCriteria(criteria: HistoriqueCriteria): Observable<Document[]> {
    return this.http.post<Historique[]>(this.resourceUrl + '/query', criteria);
  }
}
