import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IDocument, Document } from '../document.model';
import { DocumentService } from '../service/document.service';
import { ILot } from 'app/entities/lot/lot.model';
import { LotService } from 'app/entities/lot/service/lot.service';
import { IPoste } from 'app/entities/poste/poste.model';
import { PosteService } from 'app/entities/poste/service/poste.service';

@Component({
  selector: 'inetum-document-update',
  templateUrl: './document-update.component.html',
})
export class DocumentUpdateComponent implements OnInit {
  isSaving = false;

  lotsSharedCollection: ILot[] = [];
  postesSharedCollection: IPoste[] = [];

  editForm = this.fb.group({
    id: [],
    creation: [null, [Validators.required]],
    impression: [],
    printer: [],
    printStatus: [],
    lot1: [null, Validators.required],
    lot2: [],
    poste: [null, Validators.required],
  });

  constructor(
    protected documentService: DocumentService,
    protected lotService: LotService,
    protected posteService: PosteService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ document }) => {
      if (document.id === undefined) {
        const today = dayjs().startOf('day');
        document.creation = today;
        document.impression = today;
      }

      this.updateForm(document);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const document = this.createFromForm();
    if (document.id !== undefined) {
      this.subscribeToSaveResponse(this.documentService.update(document));
    } else {
      this.subscribeToSaveResponse(this.documentService.create(document));
    }
  }

  trackLotById(index: number, item: ILot): number {
    return item.id!;
  }

  trackPosteById(index: number, item: IPoste): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocument>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(document: IDocument): void {
    this.editForm.patchValue({
      id: document.id,
      creation: document.creation ? document.creation.format(DATE_TIME_FORMAT) : null,
      impression: document.impression ? document.impression.format(DATE_TIME_FORMAT) : null,
      printer: document.printer,
      printStatus: document.printStatus,
      lot1: document.lot1,
      lot2: document.lot2,
      poste: document.poste,
    });

    this.lotsSharedCollection = this.lotService.addLotToCollectionIfMissing(this.lotsSharedCollection, document.lot1, document.lot2);
    this.postesSharedCollection = this.posteService.addPosteToCollectionIfMissing(this.postesSharedCollection, document.poste);
  }

  protected loadRelationshipsOptions(): void {
    this.lotService
      .query()
      .pipe(map((res: HttpResponse<ILot[]>) => res.body ?? []))
      .pipe(
        map((lots: ILot[]) =>
          this.lotService.addLotToCollectionIfMissing(lots, this.editForm.get('lot1')!.value, this.editForm.get('lot2')!.value)
        )
      )
      .subscribe((lots: ILot[]) => (this.lotsSharedCollection = lots));

    this.posteService
      .query()
      .pipe(map((res: HttpResponse<IPoste[]>) => res.body ?? []))
      .pipe(map((postes: IPoste[]) => this.posteService.addPosteToCollectionIfMissing(postes, this.editForm.get('poste')!.value)))
      .subscribe((postes: IPoste[]) => (this.postesSharedCollection = postes));
  }

  protected createFromForm(): IDocument {
    return {
      ...new Document(),
      id: this.editForm.get(['id'])!.value,
      creation: this.editForm.get(['creation'])!.value ? dayjs(this.editForm.get(['creation'])!.value, DATE_TIME_FORMAT) : undefined,
      impression: this.editForm.get(['impression'])!.value ? dayjs(this.editForm.get(['impression'])!.value, DATE_TIME_FORMAT) : undefined,
      printer: this.editForm.get(['printer'])!.value,
      printStatus: this.editForm.get(['printStatus'])!.value,
      lot1: this.editForm.get(['lot1'])!.value,
      lot2: this.editForm.get(['lot2'])!.value,
      poste: this.editForm.get(['poste'])!.value,
    };
  }
}
