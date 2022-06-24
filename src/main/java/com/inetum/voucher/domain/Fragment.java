package com.inetum.voucher.domain;

public class Fragment {

    public String N_LOT;
    public String PRINT_STATUS;
    public int START;
    public int STOP;
    public String PRINTER;
    public String POSTE_ID;
    public Integer count;
    public Integer count100;
    public Integer count50;

    public String getN_LOT() {
        return N_LOT;
    }

    public void setN_LOT(String n_LOT) {
        N_LOT = n_LOT;
    }

    public String getPRINT_STATUS() {
        return PRINT_STATUS;
    }

    public void setPRINT_STATUS(String PRINT_STATUS) {
        this.PRINT_STATUS = PRINT_STATUS;
    }

    public int getSTART() {
        return START;
    }

    public void setSTART(int START) {
        this.START = START;
    }

    public int getSTOP() {
        return STOP;
    }

    public void setSTOP(int STOP) {
        this.STOP = STOP;
    }

    public String getPRINTER() {
        return PRINTER;
    }

    public void setPRINTER(String PRINTER) {
        this.PRINTER = PRINTER;
    }

    public String getPOSTE_ID() {
        return POSTE_ID;
    }

    public void setPOSTE_ID(String POSTE_ID) {
        this.POSTE_ID = POSTE_ID;
    }
}
