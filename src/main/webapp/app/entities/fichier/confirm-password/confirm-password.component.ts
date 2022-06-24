import { Component } from '@angular/core';
import { FichierService } from 'app/entities/fichier/service/fichier.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Fichier, IFichier } from 'app/entities/fichier/fichier.model';
import { IDistributeur } from 'app/entities/distributeur/distributeur.model';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { FichierComponent } from 'app/entities/fichier/list/fichier.component';

@Component({
  selector: 'inetum-confirm-password',
  templateUrl: './confirm-password.component.html',
})
export class ConfirmPasswordComponent {
  fichier?: IFichier;
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    path: [null, [Validators.required, Validators.minLength(8)]],
    count: [null, [Validators.required, Validators.min(50)]],
    password: [null, [Validators.required, Validators.minLength(3)]],
    distributeur: [null, Validators.required],
    ouverture: [],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected fichierService: FichierService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.updateForm(this.fichier);
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.fichierService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
  createFromForm(): IFichier {
    return {
      ...new Fichier(),
      id: this.editForm.get(['id'])!.value,
      path: this.editForm.get(['path'])!.value,
      count: this.editForm.get(['count'])!.value,
      password: this.editForm.get(['password'])!.value,
      distributeur: this.editForm.get(['distributeur'])!.value,
    };
  }

  updateForm(fichier: IFichier | undefined): void {
    this.editForm.patchValue({
      id: fichier?.id,
      path: fichier?.path,
      count: fichier?.count,
      password: fichier?.password,
      distributeur: fichier?.distributeur,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const fichier = this.createFromForm();
    if (fichier.id !== undefined) {
      this.fichierService.update(fichier).subscribe(res => {
        console.log('oumaima');
        this.activeModal.close('deleted');
      });
    }
  }

  trackDistributeurById(index: number, item: IDistributeur): number {
    return item.id!;
  }

  subscribeToSaveResponse(result: Observable<HttpResponse<IFichier>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe();
  }

  onSaveFinalize(): void {
    this.isSaving = false;
  }
}
