import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FichierDetailComponent } from './fichier-detail.component';

describe('Component Tests', () => {
  describe('Fichier Management Detail Component', () => {
    let comp: FichierDetailComponent;
    let fixture: ComponentFixture<FichierDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FichierDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ fichier: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(FichierDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FichierDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load fichier on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.fichier).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
