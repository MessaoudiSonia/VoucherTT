jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PosteService } from '../service/poste.service';
import { IPoste, Poste } from '../poste.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IDistributeur } from 'app/entities/distributeur/distributeur.model';
import { DistributeurService } from 'app/entities/distributeur/service/distributeur.service';

import { PosteUpdateComponent } from './poste-update.component';

describe('Component Tests', () => {
  describe('Poste Management Update Component', () => {
    let comp: PosteUpdateComponent;
    let fixture: ComponentFixture<PosteUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let posteService: PosteService;
    let userService: UserService;
    let distributeurService: DistributeurService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PosteUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PosteUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PosteUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      posteService = TestBed.inject(PosteService);
      userService = TestBed.inject(UserService);
      distributeurService = TestBed.inject(DistributeurService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call User query and add missing value', () => {
        const poste: IPoste = { id: 456 };
        const internalUser: IUser = { id: 87926 };
        poste.internalUser = internalUser;

        const userCollection: IUser[] = [{ id: 47918 }];
        spyOn(userService, 'query').and.returnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [internalUser];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        spyOn(userService, 'addUserToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ poste });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Distributeur query and add missing value', () => {
        const poste: IPoste = { id: 456 };
        const distributeur: IDistributeur = { id: 92808 };
        poste.distributeur = distributeur;

        const distributeurCollection: IDistributeur[] = [{ id: 30474 }];
        spyOn(distributeurService, 'query').and.returnValue(of(new HttpResponse({ body: distributeurCollection })));
        const additionalDistributeurs = [distributeur];
        const expectedCollection: IDistributeur[] = [...additionalDistributeurs, ...distributeurCollection];
        spyOn(distributeurService, 'addDistributeurToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ poste });
        comp.ngOnInit();

        expect(distributeurService.query).toHaveBeenCalled();
        expect(distributeurService.addDistributeurToCollectionIfMissing).toHaveBeenCalledWith(
          distributeurCollection,
          ...additionalDistributeurs
        );
        expect(comp.distributeursSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const poste: IPoste = { id: 456 };
        const internalUser: IUser = { id: 13820 };
        poste.internalUser = internalUser;
        const distributeur: IDistributeur = { id: 22458 };
        poste.distributeur = distributeur;

        activatedRoute.data = of({ poste });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(poste));
        expect(comp.usersSharedCollection).toContain(internalUser);
        expect(comp.distributeursSharedCollection).toContain(distributeur);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const poste = { id: 123 };
        spyOn(posteService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ poste });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: poste }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(posteService.update).toHaveBeenCalledWith(poste);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const poste = new Poste();
        spyOn(posteService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ poste });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: poste }));
        saveSubject.complete();

        // THEN
        expect(posteService.create).toHaveBeenCalledWith(poste);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const poste = { id: 123 };
        spyOn(posteService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ poste });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(posteService.update).toHaveBeenCalledWith(poste);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

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
