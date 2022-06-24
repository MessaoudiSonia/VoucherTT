import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILot, Lot } from '../lot.model';
import { LotService } from '../service/lot.service';
import { IFichier } from 'app/entities/fichier/fichier.model';
import { FichierService } from 'app/entities/fichier/service/fichier.service';

@Component({
  selector: 'inetum-lot-update',
  templateUrl: './lot-update.component.html',
})
export class LotUpdateComponent implements OnInit {
  isSaving = false;

  fichiersSharedCollection: IFichier[] = [];

  editForm = this.fb.group({
    id: [],
    offset: [null, [Validators.required, Validators.min(0)]],
    fichier: [null, Validators.required],
  });

  constructor(
    protected lotService: LotService,
    protected fichierService: FichierService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lot }) => {
      this.updateForm(lot);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const lot = this.createFromForm();
    if (lot.id !== undefined) {
      this.subscribeToSaveResponse(this.lotService.update(lot));
    } else {
      this.subscribeToSaveResponse(this.lotService.create(lot));
    }
  }

  trackFichierById(index: number, item: IFichier): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILot>>): void {
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

  protected updateForm(lot: ILot): void {
    this.editForm.patchValue({
      id: lot.id,
      offset: lot.offset,
      fichier: lot.fichier,
    });

    this.fichiersSharedCollection = this.fichierService.addFichierToCollectionIfMissing(this.fichiersSharedCollection, lot.fichier);
  }

  protected loadRelationshipsOptions(): void {
    this.fichierService
      .query()
      .pipe(map((res: HttpResponse<IFichier[]>) => res.body ?? []))
      .pipe(
        map((fichiers: IFichier[]) => this.fichierService.addFichierToCollectionIfMissing(fichiers, this.editForm.get('fichier')!.value))
      )
      .subscribe((fichiers: IFichier[]) => (this.fichiersSharedCollection = fichiers));
  }

  protected createFromForm(): ILot {
    return {
      ...new Lot(),
      id: this.editForm.get(['id'])!.value,
      offset: this.editForm.get(['offset'])!.value,
      fichier: this.editForm.get(['fichier'])!.value,
    };
  }
}
