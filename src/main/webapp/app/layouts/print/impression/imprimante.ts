import { IUser } from 'app/entities/user/user.model';
import { IDistributeur } from 'app/entities/distributeur/distributeur.model';

export class Imprimante {
  name!: string;
  ip!: string;

  constructor(name: string, ip: string) {
    this.name = name;
    this.ip = ip;
  }
}
