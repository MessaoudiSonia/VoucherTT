package com.inetum.voucher.service.dto;

import com.inetum.voucher.domain.enumeration.PrintStatus;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;
import javax.validation.constraints.NotNull;

/**
 * A DTO for the {@link com.inetum.voucher.domain.Document} entity.
 */
public class HistoriqueDTO implements Serializable {

    private Long id;

    @NotNull
    private ZonedDateTime creation;

    private ZonedDateTime impression;

    private String printer;

    private PrintStatus printStatus;

    private DocumentDTO document;

    String livraison;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getCreation() {
        return creation;
    }

    public void setCreation(ZonedDateTime creation) {
        this.creation = creation;
    }

    public ZonedDateTime getImpression() {
        return impression;
    }

    public void setImpression(ZonedDateTime impression) {
        this.impression = impression;
    }

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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof HistoriqueDTO)) {
            return false;
        }

        HistoriqueDTO documentDTO = (HistoriqueDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, documentDTO.id);
    }

    public String getLivraison() {
        return livraison;
    }

    public void setLivraison(String livraison) {
        this.livraison = livraison;
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    public DocumentDTO getDocument() {
        return document;
    }

    public void setDocument(DocumentDTO document) {
        this.document = document;
    }

    @Override
    public String toString() {
        return (
            "HistoriqueDTO{" +
            "id=" +
            id +
            ", creation=" +
            creation +
            ", impression=" +
            impression +
            ", printer='" +
            printer +
            '\'' +
            ", printStatus=" +
            printStatus +
            ", documentDTO=" +
            document +
            ", livraison='" +
            livraison +
            '\'' +
            '}'
        );
    }
}
