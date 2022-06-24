import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { getFichierIdentifier, Fichier, IFichier } from '../fichier.model';
import { IDocument } from 'app/entities/document/document.model';
import { map } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<IFichier>;
export type EntityArrayResponseType = HttpResponse<IFichier[]>;

@Injectable({ providedIn: 'root' })
export class FichierService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/fichiers');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(fichier: IFichier): Observable<EntityResponseType> {
    return this.http.post<IFichier>(this.resourceUrl, fichier, { observe: 'response' });
  }

  update(fichier: IFichier): Observable<EntityResponseType> {
    return this.http.put<IFichier>(`${this.resourceUrl}/${getFichierIdentifier(fichier) as number}`, fichier, { observe: 'response' });
  }

  partialUpdate(fichier: IFichier): Observable<EntityResponseType> {
    return this.http.patch<IFichier>(`${this.resourceUrl}/${getFichierIdentifier(fichier) as number}`, fichier, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFichier>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findLigneRestant(id: number): Observable<any> {
    return this.http.get<any>(`${this.resourceUrl + '/getLigneRestant'}/${id}`, { observe: 'response' });
  }
  findBySerial(file: string, pwd: number, serial: string): Observable<IDocument[]> {
    const body = new HttpParams().set('file', file);
    return this.http.get<IDocument[]>(`${this.resourceUrl}/getDocsBySerial/${pwd}/${serial}`, { params: body });
  }
  getIdDocBySerial(file: string, pwd: number, serial: string): Observable<IDocument> {
    const body = new HttpParams().set('file', file);
    return this.http.get<IDocument>(`${this.resourceUrl}/getDocIdBySerial/${pwd}/${serial}`, { params: body });
  }
  getCountRecords(file: string, password: string): Observable<any> {
    return this.http.get<any>(`${this.resourceUrl + '/getCountRecords'}/${file}/${password}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFichier[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFichierToCollectionIfMissing(fichierCollection: IFichier[], ...fichiersToCheck: (IFichier | null | undefined)[]): IFichier[] {
    const fichiers: IFichier[] = fichiersToCheck.filter(isPresent);
    if (fichiers.length > 0) {
      const fichierCollectionIdentifiers = fichierCollection.map(fichierItem => getFichierIdentifier(fichierItem)!);
      const fichiersToAdd = fichiers.filter(fichierItem => {
        const fichierIdentifier = getFichierIdentifier(fichierItem);
        if (fichierIdentifier == null || fichierCollectionIdentifiers.includes(fichierIdentifier)) {
          return false;
        }
        fichierCollectionIdentifiers.push(fichierIdentifier);
        return true;
      });
      return [...fichiersToAdd, ...fichierCollection];
    }
    return fichierCollection;
  }

  findAll(): Observable<Fichier[]> {
    return this.http.get<Fichier[]>(this.resourceUrl);
  }

  findById(id: number): Observable<Fichier> {
    return this.http.get<Fichier>(`${this.resourceUrl}/${id}`);
  }
}
