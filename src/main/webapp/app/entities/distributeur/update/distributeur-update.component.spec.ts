jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { DistributeurService } from '../service/distributeur.service';
import { IDistributeur, Distributeur } from '../distributeur.model';

import { DistributeurUpdateComponent } from './distributeur-update.component';

describe('Component Tests', () => {
  describe('Distributeur Management Update Component', () => {
    let comp: DistributeurUpdateComponent;
    let fixture: ComponentFixture<DistributeurUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let distributeurService: DistributeurService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DistributeurUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(DistributeurUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DistributeurUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      distributeurService = TestBed.inject(DistributeurService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const distributeur: IDistributeur = { id: 456 };

        activatedRoute.data = of({ distributeur });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(distributeur));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const distributeur = { id: 123 };
        spyOn(distributeurService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ distributeur });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: distributeur }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(distributeurService.update).toHaveBeenCalledWith(distributeur);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const distributeur = new Distributeur();
        spyOn(distributeurService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ distributeur });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: distributeur }));
        saveSubject.complete();

        // THEN
        expect(distributeurService.create).toHaveBeenCalledWith(distributeur);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const distributeur = { id: 123 };
        spyOn(distributeurService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ distributeur });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(distributeurService.update).toHaveBeenCalledWith(distributeur);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
