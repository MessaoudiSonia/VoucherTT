jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IDistributeur, Distributeur } from '../distributeur.model';
import { DistributeurService } from '../service/distributeur.service';

import { DistributeurRoutingResolveService } from './distributeur-routing-resolve.service';

describe('Service Tests', () => {
  describe('Distributeur routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: DistributeurRoutingResolveService;
    let service: DistributeurService;
    let resultDistributeur: IDistributeur | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(DistributeurRoutingResolveService);
      service = TestBed.inject(DistributeurService);
      resultDistributeur = undefined;
    });

    describe('resolve', () => {
      it('should return IDistributeur returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDistributeur = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultDistributeur).toEqual({ id: 123 });
      });

      it('should return new IDistributeur if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDistributeur = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultDistributeur).toEqual(new Distributeur());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDistributeur = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultDistributeur).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
