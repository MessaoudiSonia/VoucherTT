import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DistributeurService } from '../service/distributeur.service';

import { DistributeurComponent } from './distributeur.component';

describe('Component Tests', () => {
  describe('Distributeur Management Component', () => {
    let comp: DistributeurComponent;
    let fixture: ComponentFixture<DistributeurComponent>;
    let service: DistributeurService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DistributeurComponent],
      })
        .overrideTemplate(DistributeurComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DistributeurComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(DistributeurService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.distributeurs?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
