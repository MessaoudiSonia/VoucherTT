jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { DocumentService } from '../service/document.service';
import { IDocument, Document } from '../document.model';
import { ILot } from 'app/entities/lot/lot.model';
import { LotService } from 'app/entities/lot/service/lot.service';
import { IPoste } from 'app/entities/poste/poste.model';
import { PosteService } from 'app/entities/poste/service/poste.service';

import { DocumentUpdateComponent } from './document-update.component';

describe('Component Tests', () => {
  describe('Document Management Update Component', () => {
    let comp: DocumentUpdateComponent;
    let fixture: ComponentFixture<DocumentUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let documentService: DocumentService;
    let lotService: LotService;
    let posteService: PosteService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DocumentUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(DocumentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DocumentUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      documentService = TestBed.inject(DocumentService);
      lotService = TestBed.inject(LotService);
      posteService = TestBed.inject(PosteService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Lot query and add missing value', () => {
        const document: IDocument = { id: 456 };
        const lot1: ILot = { id: 75177 };
        document.lot1 = lot1;
        const lot2: ILot = { id: 17020 };
        document.lot2 = lot2;

        const lotCollection: ILot[] = [{ id: 2488 }];
        spyOn(lotService, 'query').and.returnValue(of(new HttpResponse({ body: lotCollection })));
        const additionalLots = [lot1, lot2];
        const expectedCollection: ILot[] = [...additionalLots, ...lotCollection];
        spyOn(lotService, 'addLotToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ document });
        comp.ngOnInit();

        expect(lotService.query).toHaveBeenCalled();
        expect(lotService.addLotToCollectionIfMissing).toHaveBeenCalledWith(lotCollection, ...additionalLots);
        expect(comp.lotsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Poste query and add missing value', () => {
        const document: IDocument = { id: 456 };
        const poste: IPoste = { id: 41880 };
        document.poste = poste;

        const posteCollection: IPoste[] = [{ id: 36564 }];
        spyOn(posteService, 'query').and.returnValue(of(new HttpResponse({ body: posteCollection })));
        const additionalPostes = [poste];
        const expectedCollection: IPoste[] = [...additionalPostes, ...posteCollection];
        spyOn(posteService, 'addPosteToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ document });
        comp.ngOnInit();

        expect(posteService.query).toHaveBeenCalled();
        expect(posteService.addPosteToCollectionIfMissing).toHaveBeenCalledWith(posteCollection, ...additionalPostes);
        expect(comp.postesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const document: IDocument = { id: 456 };
        const lot1: ILot = { id: 24863 };
        document.lot1 = lot1;
        const lot2: ILot = { id: 97571 };
        document.lot2 = lot2;
        const poste: IPoste = { id: 47828 };
        document.poste = poste;

        activatedRoute.data = of({ document });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(document));
        expect(comp.lotsSharedCollection).toContain(lot1);
        expect(comp.lotsSharedCollection).toContain(lot2);
        expect(comp.postesSharedCollection).toContain(poste);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const document = { id: 123 };
        spyOn(documentService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ document });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: document }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(documentService.update).toHaveBeenCalledWith(document);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const document = new Document();
        spyOn(documentService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ document });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: document }));
        saveSubject.complete();

        // THEN
        expect(documentService.create).toHaveBeenCalledWith(document);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const document = { id: 123 };
        spyOn(documentService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ document });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(documentService.update).toHaveBeenCalledWith(document);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackLotById', () => {
        it('Should return tracked Lot primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackLotById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackPosteById', () => {
        it('Should return tracked Poste primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPosteById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
