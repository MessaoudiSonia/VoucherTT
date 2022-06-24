import { Component, OnInit } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { Observable } from 'rxjs';
import { Account } from 'app/core/auth/account.model';
import { FormBuilder, Validators } from '@angular/forms';
import { PasswordService } from 'app/account/password/password.service';
import { SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'inetum-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  doNotMatch = false;
  error = false;
  success = false;
  account$?: Observable<Account | null>;
  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
  });
  constructor(
    private passwordService: PasswordService,
    private accountService: AccountService,
    private loginService: LoginService,
    private fb: FormBuilder,
    private $sessionStorage: SessionStorageService,
    private router: Router,
    private toastr: ToastrService,
    private electronSevice: ElectronService
  ) {}
  ngOnInit(): void {
    console.log('retrieve1 on init', this.$sessionStorage.retrieve('authenticationToken'));
  }

  changePassword(): void {
    this.error = false;
    this.success = false;
    this.doNotMatch = false;
    const newPassword = this.passwordForm.get(['newPassword'])!.value;
    if (newPassword !== this.passwordForm.get(['confirmPassword'])!.value) {
      this.doNotMatch = true;
    } else {
      if (this.electronSevice.isElectronApp) {
        console.log('changer password poste');
        this.passwordService.save(newPassword, this.passwordForm.get(['currentPassword'])!.value).subscribe(
          () => {
            this.success = true;
            this.toastr.success('votre mot de passe a été changé');
            this.router.navigate(['login']);
          },
          () => (this.error = true)
        );
      } else {
        console.log('changer password agent');
        this.passwordService.saveAgent(newPassword, this.passwordForm.get(['currentPassword'])!.value).subscribe(
          () => {
            this.success = true;
            this.toastr.success('votre mot de passe a été changé');
            this.loginService.logout();
            this.router.navigate(['login']);
          },
          () => (this.error = true)
        );
      }
    }
  }
}
