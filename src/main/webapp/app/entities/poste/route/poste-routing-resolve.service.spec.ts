jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPoste, Poste } from '../poste.model';
import { PosteService } from '../service/poste.service';

import { PosteRoutingResolveService } from './poste-routing-resolve.service';

describe('Service Tests', () => {
  describe('Poste routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PosteRoutingResolveService;
    let service: PosteService;
    let resultPoste: IPoste | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PosteRoutingResolveService);
      service = TestBed.inject(PosteService);
      resultPoste = undefined;
    });

    describe('resolve', () => {
      it('should return IPoste returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPoste = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPoste).toEqual({ id: 123 });
      });

      it('should return new IPoste if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPoste = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPoste).toEqual(new Poste());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPoste = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPoste).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
