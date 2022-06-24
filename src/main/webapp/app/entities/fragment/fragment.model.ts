export interface IFragment {
  N_LOT?: string;
  PRINT_STATUS?: string;
  START?: string;
  STOP?: string;
  PRINTER?: string;
  POSTE_ID?: string;
  count?: number;
  count50?: number;
  count100?: number;
}

export class Fragment implements IFragment {
  N_LOT?: string;
  PRINT_STATUS?: string;
  START?: string;
  STOP?: string;
  PRINTER?: string;
  POSTE_ID?: string;
  count?: number;
  count50: number;
  count100: number;

  constructor(
    N_LOT?: string,
    PRINT_STATUS?: string,
    START?: string,
    STOP?: string,
    PRINTER?: string,
    POSTE_ID?: string,
    count?: number,
    count50?: number,
    count100?: number
  ) {
    this.count100 = 0;
    this.count50 = 0;
  }
}
