import { Component, ViewChild, OnInit, AfterViewInit, ElementRef, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';
import { PosteService } from 'app/entities/poste/service/poste.service';
import { ElectronService } from 'ngx-electron';
import { LocalStorage, SessionStorageService } from 'ngx-webstorage';
import { ToastrService } from 'ngx-toastr';
import { PrintService } from 'app/layouts/print/impression/print.service';
@Component({
  selector: 'inetum-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('username', { static: false })
  username?: ElementRef;

  authenticationError = false;

  loginForm = this.fb.group({
    username: [null, [Validators.required]],
    password: [null, [Validators.required]],
    rememberMe: [false],
  });

  constructor(
    private accountService: AccountService,
    private loginService: LoginService,
    private router: Router,
    private fb: FormBuilder,
    private posteService: PosteService,
    public printService: PrintService,
    private electronSevice: ElectronService,
    private $sessionStorage: SessionStorageService,
    private toastr: ToastrService
  ) {
    try {
      this.electronSevice.ipcRenderer.on('verifClose', (evt: any, message1: any) => {
        console.log('length', Object.values(this.printService.printObservers).length);
        if (Object.values(this.printService.printObservers).length !== 0) {
          this.toastr.error('il ya une impression en cours');
        } else {
          this.electronSevice.ipcRenderer.send('noJob');
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
  ngOnInit(): void {
    // if already authenticated then navigate to home page
    this.accountService.identity().subscribe(() => {
      if (this.accountService.isAuthenticated()) {
        this.router.navigate(['']);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.username) {
      this.username.nativeElement.focus();
    }
  }

  login(): void {
    this.loginService
      .login({
        username: this.loginForm.get('username')!.value,
        password: this.loginForm.get('password')!.value,
        rememberMe: this.loginForm.get('rememberMe')!.value,
      })
      .subscribe(
        res => {
          console.log('res', res);
          console.log('login user', res?.login);
          console.log('role user', res?.authorities[0]);
          if (res !== null) {
            localStorage.setItem('roleUser', res.authorities[0]);
            localStorage.setItem('idInternalUser', res.id);
          }
          if (res?.authorities.includes('ROLE_IGNORE')) {
            this.authenticationError = false;
            console.log('retrieve1 on login', this.$sessionStorage.retrieve('authenticationToken'));
            console.log('erreur');
            this.router.navigate(['/404NOTFOUND']);
          }
          if (this.electronSevice.isElectronApp) {
            if (!res?.authorities.includes('ROLE_POSTE')) {
              this.authenticationError = true;

              this.loginService.logout();
            } else {
              this.authenticationError = false;
              if (!this.router.getCurrentNavigation()) {
                // There were no routing during login (eg from navigationToStoredUrl)
                this.router.navigate(['']);
              }
            }
          } else {
            if (res?.authorities.includes('ROLE_POSTE')) {
              this.authenticationError = true;

              this.loginService.logout();
              //   this.router.navigate(['/404NOTFOUND']);
            } else {
              this.authenticationError = false;
              if (!this.router.getCurrentNavigation()) {
                console.log('authentification distributeur');
                this.router.navigate(['']);
              }
            }
          }
        },
        () => {
          this.authenticationError = true;
        }
        //         ()=>{
        // }
      );
  }
}
