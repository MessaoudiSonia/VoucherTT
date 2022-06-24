import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { ElectronService } from 'ngx-electron';
import { PrintService } from 'app/layouts/print/impression/print.service';
import { ToastrService } from 'ngx-toastr';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'inetum-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  authSubscription?: Subscription;

  constructor(
    private accountService: AccountService,
    private router: Router,
    public printService: PrintService,
    private electronSevice: ElectronService,
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
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
    console.log('account', this.account);
    console.log('accountId', this.account?.id);
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
