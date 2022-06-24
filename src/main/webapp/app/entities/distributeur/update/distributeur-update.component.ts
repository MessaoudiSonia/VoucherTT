import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IDistributeur, Distributeur } from '../distributeur.model';
import { DistributeurService } from '../service/distributeur.service';

@Component({
  selector: 'inetum-distributeur-update',
  templateUrl: './distributeur-update.component.html',
})
export class DistributeurUpdateComponent implements OnInit {
  isSaving = false;
  disabled = false;
  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    code: [null, [Validators.required]],
    codeReimpression: [null, Validators.required],
  });
  isCreated!: Observable<boolean>;

  constructor(protected distributeurService: DistributeurService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ distributeur }) => {
      this.updateForm(distributeur);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const distributeur = this.createFromForm();
    if (distributeur.id !== undefined) {
      this.subscribeToSaveResponse(this.distributeurService.update(distributeur));
    } else {
      this.subscribeToSaveResponse(this.distributeurService.create(distributeur));
    }
  }

  saveDirectory(): void {
    this.isSaving = true;
    const distributeur = this.createFromForm();
    if (distributeur.id !== undefined) {
      this.subscribeToSaveResponse(this.distributeurService.update(distributeur));
    } else {
      this.isCreated = this.distributeurService.createDirectory(distributeur);
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDistributeur>>): void {
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

  protected updateForm(distributeur: IDistributeur): void {
    this.editForm.patchValue({
      id: distributeur.id,
      nom: distributeur.nom,
      code: distributeur.code,
      codeReimpression: distributeur.codeReimpression,
    });
    console.log('idDistributeur', distributeur.id);
    if (distributeur.id !== undefined) {
      this.disabled = true;
    }
  }

  protected createFromForm(): IDistributeur {
    return {
      ...new Distributeur(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      code: this.editForm.get(['code'])!.value,
      codeReimpression: this.editForm.get(['codeReimpression'])!.value,
    };
  }
}
