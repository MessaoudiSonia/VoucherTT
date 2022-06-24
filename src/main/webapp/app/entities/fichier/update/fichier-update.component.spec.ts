jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FichierService } from '../service/fichier.service';
import { IFichier, Fichier } from '../fichier.model';
import { IDistributeur } from 'app/entities/distributeur/distributeur.model';
import { DistributeurService } from 'app/entities/distributeur/service/distributeur.service';

import { FichierUpdateComponent } from './fichier-update.component';

describe('Component Tests', () => {
  describe('Fichier Management Update Component', () => {
    let comp: FichierUpdateComponent;
    let fixture: ComponentFixture<FichierUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let fichierService: FichierService;
    let distributeurService: DistributeurService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FichierUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FichierUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FichierUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      fichierService = TestBed.inject(FichierService);
      distributeurService = TestBed.inject(DistributeurService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Distributeur query and add missing value', () => {
        const fichier: IFichier = { id: 456 };
        const distributeur: IDistributeur = { id: 36125 };
        fichier.distributeur = distributeur;

        const distributeurCollection: IDistributeur[] = [{ id: 86837 }];
        spyOn(distributeurService, 'query').and.returnValue(of(new HttpResponse({ body: distributeurCollection })));
        const additionalDistributeurs = [distributeur];
        const expectedCollection: IDistributeur[] = [...additionalDistributeurs, ...distributeurCollection];
        spyOn(distributeurService, 'addDistributeurToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ fichier });
        comp.ngOnInit();

        expect(distributeurService.query).toHaveBeenCalled();
        expect(distributeurService.addDistributeurToCollectionIfMissing).toHaveBeenCalledWith(
          distributeurCollection,
          ...additionalDistributeurs
        );
        expect(comp.distributeursSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const fichier: IFichier = { id: 456 };
        const distributeur: IDistributeur = { id: 76447 };
        fichier.distributeur = distributeur;

        activatedRoute.data = of({ fichier });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(fichier));
        expect(comp.distributeursSharedCollection).toContain(distributeur);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fichier = { id: 123 };
        spyOn(fichierService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fichier });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: fichier }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(fichierService.update).toHaveBeenCalledWith(fichier);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fichier = new Fichier();
        spyOn(fichierService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fichier });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: fichier }));
        saveSubject.complete();

        // THEN
        expect(fichierService.create).toHaveBeenCalledWith(fichier);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fichier = { id: 123 };
        spyOn(fichierService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fichier });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(fichierService.update).toHaveBeenCalledWith(fichier);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackDistributeurById', () => {
        it('Should return tracked Distributeur primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackDistributeurById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
