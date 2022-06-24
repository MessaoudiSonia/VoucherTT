import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFichier, Fichier } from '../fichier.model';
import { FichierService } from '../service/fichier.service';
import { IDistributeur } from 'app/entities/distributeur/distributeur.model';
import { DistributeurService } from 'app/entities/distributeur/service/distributeur.service';

@Component({
  selector: 'inetum-fichier-update',
  templateUrl: './fichier-update.component.html',
})
export class FichierUpdateComponent implements OnInit {
  isSaving = false;

  distributeursSharedCollection: IDistributeur[] = [];

  editForm = this.fb.group({
    id: [],
    path: [null, [Validators.required, Validators.minLength(8)]],
    count: [null, [Validators.required, Validators.min(50)]],
    password: [null, [Validators.required, Validators.minLength(3)]],
    distributeur: [null, Validators.required],
  });

  constructor(
    protected fichierService: FichierService,
    protected distributeurService: DistributeurService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fichier }) => {
      this.updateForm(fichier);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const fichier = this.createFromForm();
    if (fichier.id !== undefined) {
      this.subscribeToSaveResponse(this.fichierService.update(fichier));
    } else {
      this.subscribeToSaveResponse(this.fichierService.create(fichier));
    }
  }

  trackDistributeurById(index: number, item: IDistributeur): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFichier>>): void {
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

  protected updateForm(fichier: IFichier): void {
    this.editForm.patchValue({
      id: fichier.id,
      path: fichier.path,
      count: fichier.count,
      password: fichier.password,
      distributeur: fichier.distributeur,
    });

    this.distributeursSharedCollection = this.distributeurService.addDistributeurToCollectionIfMissing(
      this.distributeursSharedCollection,
      fichier.distributeur
    );
  }

  protected loadRelationshipsOptions(): void {
    this.distributeurService
      .query()
      .pipe(map((res: HttpResponse<IDistributeur[]>) => res.body ?? []))
      .pipe(
        map((distributeurs: IDistributeur[]) =>
          this.distributeurService.addDistributeurToCollectionIfMissing(distributeurs, this.editForm.get('distributeur')!.value)
        )
      )
      .subscribe((distributeurs: IDistributeur[]) => (this.distributeursSharedCollection = distributeurs));
  }

  protected createFromForm(): IFichier {
    return {
      ...new Fichier(),
      id: this.editForm.get(['id'])!.value,
      path: this.editForm.get(['path'])!.value,
      count: this.editForm.get(['count'])!.value,
      password: this.editForm.get(['password'])!.value,
      distributeur: this.editForm.get(['distributeur'])!.value,
    };
  }
}
