jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IFichier, Fichier } from '../fichier.model';
import { FichierService } from '../service/fichier.service';

import { FichierRoutingResolveService } from './fichier-routing-resolve.service';

describe('Service Tests', () => {
  describe('Fichier routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: FichierRoutingResolveService;
    let service: FichierService;
    let resultFichier: IFichier | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(FichierRoutingResolveService);
      service = TestBed.inject(FichierService);
      resultFichier = undefined;
    });

    describe('resolve', () => {
      it('should return IFichier returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFichier = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultFichier).toEqual({ id: 123 });
      });

      it('should return new IFichier if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFichier = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultFichier).toEqual(new Fichier());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFichier = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultFichier).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
