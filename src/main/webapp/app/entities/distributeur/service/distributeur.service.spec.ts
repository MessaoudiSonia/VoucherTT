import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDistributeur, Distributeur } from '../distributeur.model';

import { DistributeurService } from './distributeur.service';

describe('Service Tests', () => {
  describe('Distributeur Service', () => {
    let service: DistributeurService;
    let httpMock: HttpTestingController;
    let elemDefault: IDistributeur;
    let expectedResult: IDistributeur | IDistributeur[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(DistributeurService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nom: 'AAAAAAA',
        code: 'AAAAAAA',
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

      it('should create a Distributeur', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Distributeur()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Distributeur', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nom: 'BBBBBB',
            code: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Distributeur', () => {
        const patchObject = Object.assign(
          {
            nom: 'BBBBBB',
            code: 'BBBBBB',
          },
          new Distributeur()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Distributeur', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nom: 'BBBBBB',
            code: 'BBBBBB',
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

      it('should delete a Distributeur', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addDistributeurToCollectionIfMissing', () => {
        it('should add a Distributeur to an empty array', () => {
          const distributeur: IDistributeur = { id: 123 };
          expectedResult = service.addDistributeurToCollectionIfMissing([], distributeur);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(distributeur);
        });

        it('should not add a Distributeur to an array that contains it', () => {
          const distributeur: IDistributeur = { id: 123 };
          const distributeurCollection: IDistributeur[] = [
            {
              ...distributeur,
            },
            { id: 456 },
          ];
          expectedResult = service.addDistributeurToCollectionIfMissing(distributeurCollection, distributeur);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Distributeur to an array that doesn't contain it", () => {
          const distributeur: IDistributeur = { id: 123 };
          const distributeurCollection: IDistributeur[] = [{ id: 456 }];
          expectedResult = service.addDistributeurToCollectionIfMissing(distributeurCollection, distributeur);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(distributeur);
        });

        it('should add only unique Distributeur to an array', () => {
          const distributeurArray: IDistributeur[] = [{ id: 123 }, { id: 456 }, { id: 2044 }];
          const distributeurCollection: IDistributeur[] = [{ id: 123 }];
          expectedResult = service.addDistributeurToCollectionIfMissing(distributeurCollection, ...distributeurArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const distributeur: IDistributeur = { id: 123 };
          const distributeur2: IDistributeur = { id: 456 };
          expectedResult = service.addDistributeurToCollectionIfMissing([], distributeur, distributeur2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(distributeur);
          expect(expectedResult).toContain(distributeur2);
        });

        it('should accept null and undefined values', () => {
          const distributeur: IDistributeur = { id: 123 };
          expectedResult = service.addDistributeurToCollectionIfMissing([], null, distributeur, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(distributeur);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
