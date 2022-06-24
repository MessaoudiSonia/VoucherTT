package com.inetum.voucher.service.dto;

import com.inetum.voucher.domain.enumeration.PrintStatus;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.inetum.voucher.domain.Document} entity.
 */
public class DocumentDTO implements Serializable {

    private Long id;

    @NotNull
    private ZonedDateTime creation;

    private ZonedDateTime impression;

    private String motif;

    private String printer;

    private PrintStatus printStatus;

    private LotDTO lot1;

    private LotDTO lot2;

    private long compteur;

    private PosteDTO poste;

    String livraison;

    public long getCompteur() {
        return compteur;
    }

    public void setCompteur(long compteur) {
        this.compteur = compteur;
    }

    public String getMotif() {
        return motif;
    }

    public void setMotif(String motif) {
        this.motif = motif;
    }

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

    public LotDTO getLot1() {
        return lot1;
    }

    public void setLot1(LotDTO lot1) {
        this.lot1 = lot1;
    }

    public LotDTO getLot2() {
        return lot2;
    }

    public void setLot2(LotDTO lot2) {
        this.lot2 = lot2;
    }

    public PosteDTO getPoste() {
        return poste;
    }

    public void setPoste(PosteDTO poste) {
        this.poste = poste;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DocumentDTO)) {
            return false;
        }

        DocumentDTO documentDTO = (DocumentDTO) o;
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

    @Override
    public String toString() {
        return (
            "DocumentDTO{" +
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
            ", lot1=" +
            lot1 +
            ", lot2=" +
            lot2 +
            ", poste=" +
            poste +
            ", livraison='" +
            livraison +
            '\'' +
            '}'
        );
    }
}
