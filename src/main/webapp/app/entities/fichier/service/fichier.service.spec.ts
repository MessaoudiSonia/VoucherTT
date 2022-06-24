import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFichier, Fichier } from '../fichier.model';

import { FichierService } from './fichier.service';

describe('Service Tests', () => {
  describe('Fichier Service', () => {
    let service: FichierService;
    let httpMock: HttpTestingController;
    let elemDefault: IFichier;
    let expectedResult: IFichier | IFichier[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(FichierService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        path: 'AAAAAAA',
        count: 0,
        password: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Fichier', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Fichier()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Fichier', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            path: 'BBBBBB',
            count: 1,
            password: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Fichier', () => {
        const patchObject = Object.assign(
          {
            path: 'BBBBBB',
            count: 1,
            password: 'BBBBBB',
          },
          new Fichier()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Fichier', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            path: 'BBBBBB',
            count: 1,
            password: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Fichier', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addFichierToCollectionIfMissing', () => {
        it('should add a Fichier to an empty array', () => {
          const fichier: IFichier = { id: 123 };
          expectedResult = service.addFichierToCollectionIfMissing([], fichier);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(fichier);
        });

        it('should not add a Fichier to an array that contains it', () => {
          const fichier: IFichier = { id: 123 };
          const fichierCollection: IFichier[] = [
            {
              ...fichier,
            },
            { id: 456 },
          ];
          expectedResult = service.addFichierToCollectionIfMissing(fichierCollection, fichier);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Fichier to an array that doesn't contain it", () => {
          const fichier: IFichier = { id: 123 };
          const fichierCollection: IFichier[] = [{ id: 456 }];
          expectedResult = service.addFichierToCollectionIfMissing(fichierCollection, fichier);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(fichier);
        });

        it('should add only unique Fichier to an array', () => {
          const fichierArray: IFichier[] = [{ id: 123 }, { id: 456 }, { id: 60105 }];
          const fichierCollection: IFichier[] = [{ id: 123 }];
          expectedResult = service.addFichierToCollectionIfMissing(fichierCollection, ...fichierArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const fichier: IFichier = { id: 123 };
          const fichier2: IFichier = { id: 456 };
          expectedResult = service.addFichierToCollectionIfMissing([], fichier, fichier2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(fichier);
          expect(expectedResult).toContain(fichier2);
        });

        it('should accept null and undefined values', () => {
          const fichier: IFichier = { id: 123 };
          expectedResult = service.addFichierToCollectionIfMissing([], null, fichier, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(fichier);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
