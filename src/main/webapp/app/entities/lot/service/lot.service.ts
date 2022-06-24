import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILot, getLotIdentifier } from '../lot.model';

export type EntityResponseType = HttpResponse<ILot>;
export type EntityArrayResponseType = HttpResponse<ILot[]>;

@Injectable({ providedIn: 'root' })
export class LotService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/lots');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(lot: ILot): Observable<EntityResponseType> {
    return this.http.post<ILot>(this.resourceUrl, lot, { observe: 'response' });
  }

  update(lot: ILot): Observable<EntityResponseType> {
    return this.http.put<ILot>(`${this.resourceUrl}/${getLotIdentifier(lot) as number}`, lot, { observe: 'response' });
  }

  partialUpdate(lot: ILot): Observable<EntityResponseType> {
    return this.http.patch<ILot>(`${this.resourceUrl}/${getLotIdentifier(lot) as number}`, lot, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILot>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILot[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLotToCollectionIfMissing(lotCollection: ILot[], ...lotsToCheck: (ILot | null | undefined)[]): ILot[] {
    const lots: ILot[] = lotsToCheck.filter(isPresent);
    if (lots.length > 0) {
      const lotCollectionIdentifiers = lotCollection.map(lotItem => getLotIdentifier(lotItem)!);
      const lotsToAdd = lots.filter(lotItem => {
        const lotIdentifier = getLotIdentifier(lotItem);
        if (lotIdentifier == null || lotCollectionIdentifiers.includes(lotIdentifier)) {
          return false;
        }
        lotCollectionIdentifiers.push(lotIdentifier);
        return true;
      });
      return [...lotsToAdd, ...lotCollection];
    }
    return lotCollection;
  }
}
