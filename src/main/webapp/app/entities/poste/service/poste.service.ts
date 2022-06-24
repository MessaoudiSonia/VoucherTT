import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPoste, getPosteIdentifier, Poste } from '../poste.model';
import { Document } from 'app/entities/document/document.model';

export type EntityResponseType = HttpResponse<IPoste>;
export type EntityArrayResponseType = HttpResponse<IPoste[]>;

@Injectable({ providedIn: 'root' })
export class PosteService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/postes');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(poste: IPoste): Observable<EntityResponseType> {
    return this.http.post<IPoste>(this.resourceUrl, poste, { observe: 'response' });
  }

  update(poste: IPoste): Observable<EntityResponseType> {
    return this.http.put<IPoste>(`${this.resourceUrl}/${getPosteIdentifier(poste) as number}`, poste, { observe: 'response' });
  }

  partialUpdate(poste: IPoste): Observable<EntityResponseType> {
    return this.http.patch<IPoste>(`${this.resourceUrl}/${getPosteIdentifier(poste) as number}`, poste, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPoste>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findPrivateKey(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get<any>(this.resourceUrl + '/privateCle', { headers, responseType: 'text' as 'json' });
  }

  findAll(): Observable<Poste[]> {
    return this.http.get<Poste[]>(this.resourceUrl);
  }
  findAllByDistributeur(nomDistributeur: string): Observable<Poste[]> {
    return this.http.get<Poste[]>(this.resourceUrl + `/ByDistributeur/${nomDistributeur}`);
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPoste[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPosteToCollectionIfMissing(posteCollection: IPoste[], ...postesToCheck: (IPoste | null | undefined)[]): IPoste[] {
    const postes: IPoste[] = postesToCheck.filter(isPresent);
    if (postes.length > 0) {
      const posteCollectionIdentifiers = posteCollection.map(posteItem => getPosteIdentifier(posteItem)!);
      const postesToAdd = postes.filter(posteItem => {
        const posteIdentifier = getPosteIdentifier(posteItem);
        if (posteIdentifier == null || posteCollectionIdentifiers.includes(posteIdentifier)) {
          return false;
        }
        posteCollectionIdentifiers.push(posteIdentifier);
        return true;
      });
      return [...postesToAdd, ...posteCollection];
    }
    return posteCollection;
  }
}
