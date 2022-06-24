import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LotDetailComponent } from './lot-detail.component';

describe('Component Tests', () => {
  describe('Lot Management Detail Component', () => {
    let comp: LotDetailComponent;
    let fixture: ComponentFixture<LotDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [LotDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ lot: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(LotDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LotDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load lot on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.lot).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
