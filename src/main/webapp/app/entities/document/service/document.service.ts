import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';
import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDocument, Document, getDocumentIdentifier } from '../document.model';
import { DocumentCriteria } from 'app/entities/document/document.criteria';
import { EncryptedDoc } from 'app/shared/encryptedDoc';
import { Fragment } from 'app/entities/fragment/fragment.model';
export type EntityResponseType = HttpResponse<IDocument>;
export type EntityArrayResponseType = HttpResponse<IDocument[]>;

@Injectable({ providedIn: 'root' })
export class DocumentService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/documents');
  private isLot?: string;

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(document: IDocument): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(document);
    return this.http
      .post<IDocument>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(document: IDocument): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(document);
    return this.http
      .put<IDocument>(`${this.resourceUrl}/${getDocumentIdentifier(document) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  updateMotif(document: IDocument): Observable<EntityResponseType> {
    // const copy = this.convertDateFromClient(document);
    return this.http
      .put<IDocument>(`${this.resourceUrl}/${getDocumentIdentifier(document) as number}`, document, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(document: IDocument): Observable<EntityResponseType> {
    //const copy = this.convertDateFromClient(document);
    return this.http
      .patch<IDocument>(`${this.resourceUrl}/${getDocumentIdentifier(document) as number}`, '', { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDocument>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  async findTest(id: number): Promise<any> {
    const Response = await this.http
      .get<IDocument>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)))
      .toPromise();
    return Response;
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDocument[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDocumentToCollectionIfMissing(documentCollection: IDocument[], ...documentsToCheck: (IDocument | null | undefined)[]): IDocument[] {
    const documents: IDocument[] = documentsToCheck.filter(isPresent);
    if (documents.length > 0) {
      const documentCollectionIdentifiers = documentCollection.map(documentItem => getDocumentIdentifier(documentItem)!);
      const documentsToAdd = documents.filter(documentItem => {
        const documentIdentifier = getDocumentIdentifier(documentItem);
        if (documentIdentifier == null || documentCollectionIdentifiers.includes(documentIdentifier)) {
          return false;
        }
        documentCollectionIdentifiers.push(documentIdentifier);
        return true;
      });
      return [...documentsToAdd, ...documentCollection];
    }
    return documentCollection;
  }

  findAll(): Observable<Document[]> {
    return this.http.get<Document[]>(this.resourceUrl);
  }

  findAllHistorique(): Observable<Document[]> {
    return this.http.get<Document[]>(this.resourceUrl + '/historique');
  }
  findAllHistoriqueByPoste(): Observable<Document[]> {
    return this.http.get<Document[]>(this.resourceUrl + '/historiqueByPoste');
  }

  findAllImprimantes(): Observable<any[]> {
    return this.http.get<any[]>(this.resourceUrl + '/imprimantes');
  }

  findByPrintStatus(status: string): Observable<Document[]> {
    return this.http.get<Document[]>(this.resourceUrl + '/printStatus/' + status);
  }

  getNDocuments(number: number, isDouble: string, fichierId: number, nomImprimante: string): Observable<EncryptedDoc[]> {
    this.isLot = String(isDouble);
    const body = new HttpParams().set('nomImprimante', nomImprimante);
    return this.http.get<EncryptedDoc[]>(`${this.resourceUrl}/${number}/${this.isLot}/${fichierId}`, { params: body });
  }

  getFailedDocument(id: number): Observable<EncryptedDoc> {
    return this.http.get<EncryptedDoc>(`${this.resourceUrl}/${id}/failed`);
  }

  findByPrintStatusAndPosteConnect(): Observable<Document[]> {
    return this.http.get<Document[]>(this.resourceUrl + '/Failed');
  }

  findAllCriteria(criteria: DocumentCriteria): Observable<Document[]> {
    return this.http.post<Document[]>(this.resourceUrl + '/query', criteria);
  }

  findById(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.resourceUrl}/${id}`);
  }

  UpdateStatusSuccessOfDocumentById(id: number, nomImprimante: string): Observable<any> {
    const body = new HttpParams().set('nomImprimante', nomImprimante);
    return this.http.get(`${this.resourceUrl + '/success'}/${id}`, { params: body });
  }

  UpdateStatusFailedOfDocumentById(id: number, nomImprimante: string): Observable<any> {
    const body = new HttpParams().set('nomImprimante', nomImprimante);
    return this.http.get(`${this.resourceUrl + '/failed'}/${id}`, { params: body });
  }
  groupedByOffset(id: number): Observable<Fragment[]> {
    return this.http.get<Fragment[]>(`${this.resourceUrl}/groupedByOffset/${id}`);
  }

  getDroitTimbre(): Observable<any> {
    return this.http.get<any>(this.resourceUrl + '/droitTimbre');
  }
  findAllByLivraison(codeLivraison: string): Observable<EncryptedDoc[]> {
    return this.http.get<EncryptedDoc[]>(this.resourceUrl + `/uuid/${codeLivraison}`);
  }

  protected convertDateFromClient(document: IDocument): IDocument {
    return Object.assign({}, document, {
      creation: document.creation?.isValid() ? document.creation.toJSON() : undefined,
      impression: document.impression?.isValid() ? document.impression.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.creation = res.body.creation ? dayjs(res.body.creation) : undefined;
      res.body.impression = res.body.impression ? dayjs(res.body.impression) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((document: IDocument) => {
        document.creation = document.creation ? dayjs(document.creation) : undefined;
        document.impression = document.impression ? dayjs(document.impression) : undefined;
      });
    }
    return res;
  }
}
