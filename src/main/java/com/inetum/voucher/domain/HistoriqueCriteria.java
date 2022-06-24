package com.inetum.voucher.domain;

import com.inetum.voucher.domain.enumeration.PrintStatus;

public class HistoriqueCriteria {

    private String printer;
    private PrintStatus printStatus;
    private Long posteId;
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

    public Long getPosteId() {
        return posteId;
    }

    public void setPosteId(Long posteId) {
        this.posteId = posteId;
    }

    public String getDistributeur() {
        return distributeur;
    }

    public void setDistributeur(String distributeur) {
        this.distributeur = distributeur;
    }
}
