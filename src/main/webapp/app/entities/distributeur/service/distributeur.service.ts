import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDistributeur, getDistributeurIdentifier } from '../distributeur.model';

export type EntityResponseType = HttpResponse<IDistributeur>;
export type EntityArrayResponseType = HttpResponse<IDistributeur[]>;

@Injectable({ providedIn: 'root' })
export class DistributeurService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/distributeurs');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(distributeur: IDistributeur): Observable<EntityResponseType> {
    return this.http.post<IDistributeur>(this.resourceUrl, distributeur, { observe: 'response' });
  }

  createDirectory(distributeur: IDistributeur): Observable<boolean> {
    return this.http.post<boolean>(this.resourceUrl + '/directory', distributeur);
  }

  update(distributeur: IDistributeur): Observable<EntityResponseType> {
    return this.http.put<IDistributeur>(`${this.resourceUrl}/${getDistributeurIdentifier(distributeur) as number}`, distributeur, {
      observe: 'response',
    });
  }

  partialUpdate(distributeur: IDistributeur): Observable<EntityResponseType> {
    return this.http.patch<IDistributeur>(`${this.resourceUrl}/${getDistributeurIdentifier(distributeur) as number}`, distributeur, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDistributeur>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
  findAll(): Observable<IDistributeur[]> {
    return this.http.get<IDistributeur[]>(`${this.resourceUrl}`);
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDistributeur[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDistributeurToCollectionIfMissing(
    distributeurCollection: IDistributeur[],
    ...distributeursToCheck: (IDistributeur | null | undefined)[]
  ): IDistributeur[] {
    const distributeurs: IDistributeur[] = distributeursToCheck.filter(isPresent);
    if (distributeurs.length > 0) {
      const distributeurCollectionIdentifiers = distributeurCollection.map(
        distributeurItem => getDistributeurIdentifier(distributeurItem)!
      );
      const distributeursToAdd = distributeurs.filter(distributeurItem => {
        const distributeurIdentifier = getDistributeurIdentifier(distributeurItem);
        if (distributeurIdentifier == null || distributeurCollectionIdentifiers.includes(distributeurIdentifier)) {
          return false;
        }
        distributeurCollectionIdentifiers.push(distributeurIdentifier);
        return true;
      });
      return [...distributeursToAdd, ...distributeurCollection];
    }
    return distributeurCollection;
  }
}
