jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IDocument, Document } from '../document.model';
import { DocumentService } from '../service/document.service';

import { DocumentRoutingResolveService } from './document-routing-resolve.service';

describe('Service Tests', () => {
  describe('Document routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: DocumentRoutingResolveService;
    let service: DocumentService;
    let resultDocument: IDocument | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(DocumentRoutingResolveService);
      service = TestBed.inject(DocumentService);
      resultDocument = undefined;
    });

    describe('resolve', () => {
      it('should return IDocument returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDocument = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultDocument).toEqual({ id: 123 });
      });

      it('should return new IDocument if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDocument = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultDocument).toEqual(new Document());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDocument = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultDocument).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
