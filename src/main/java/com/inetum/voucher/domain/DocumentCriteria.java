package com.inetum.voucher.domain;

import com.inetum.voucher.domain.enumeration.PrintStatus;

public class DocumentCriteria {

    private String printer;
    private PrintStatus printStatus;
    private String poste;
    private String distributeur;

    public String getPrinter() {
        return printer;
    }

    public void setPrinter(String printer) {
        this.printer = printer;
    }

    public PrintStatus getPrintStatus() {
        return printStatus;
    }

    public void setPrintStatus(PrintStatus printStatus) {
        this.printStatus = printStatus;
    }

    public String getPoste() {
        return poste;
    }

    public void setPoste(String poste) {
        this.poste = poste;
    }

    public String getDistributeur() {
        return distributeur;
    }

    public void setDistributeur(String distributeur) {
        this.distributeur = distributeur;
    }
}
