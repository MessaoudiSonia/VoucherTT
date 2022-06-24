import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILot, Lot } from '../lot.model';

import { LotService } from './lot.service';

describe('Service Tests', () => {
  describe('Lot Service', () => {
    let service: LotService;
    let httpMock: HttpTestingController;
    let elemDefault: ILot;
    let expectedResult: ILot | ILot[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(LotService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        offset: 0,
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

      it('should create a Lot', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Lot()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Lot', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            offset: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Lot', () => {
        const patchObject = Object.assign(
          {
            offset: 1,
          },
          new Lot()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Lot', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            offset: 1,
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

      it('should delete a Lot', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addLotToCollectionIfMissing', () => {
        it('should add a Lot to an empty array', () => {
          const lot: ILot = { id: 123 };
          expectedResult = service.addLotToCollectionIfMissing([], lot);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(lot);
        });

        it('should not add a Lot to an array that contains it', () => {
          const lot: ILot = { id: 123 };
          const lotCollection: ILot[] = [
            {
              ...lot,
            },
            { id: 456 },
          ];
          expectedResult = service.addLotToCollectionIfMissing(lotCollection, lot);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Lot to an array that doesn't contain it", () => {
          const lot: ILot = { id: 123 };
          const lotCollection: ILot[] = [{ id: 456 }];
          expectedResult = service.addLotToCollectionIfMissing(lotCollection, lot);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(lot);
        });

        it('should add only unique Lot to an array', () => {
          const lotArray: ILot[] = [{ id: 123 }, { id: 456 }, { id: 77160 }];
          const lotCollection: ILot[] = [{ id: 123 }];
          expectedResult = service.addLotToCollectionIfMissing(lotCollection, ...lotArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const lot: ILot = { id: 123 };
          const lot2: ILot = { id: 456 };
          expectedResult = service.addLotToCollectionIfMissing([], lot, lot2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(lot);
          expect(expectedResult).toContain(lot2);
        });

        it('should accept null and undefined values', () => {
          const lot: ILot = { id: 123 };
          expectedResult = service.addLotToCollectionIfMissing([], null, lot, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(lot);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
