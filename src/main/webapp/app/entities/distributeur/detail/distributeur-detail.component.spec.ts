import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DistributeurDetailComponent } from './distributeur-detail.component';

describe('Component Tests', () => {
  describe('Distributeur Management Detail Component', () => {
    let comp: DistributeurDetailComponent;
    let fixture: ComponentFixture<DistributeurDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [DistributeurDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ distributeur: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(DistributeurDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DistributeurDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load distributeur on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.distributeur).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
