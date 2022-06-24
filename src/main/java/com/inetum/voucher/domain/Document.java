package com.inetum.voucher.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.inetum.voucher.domain.enumeration.PrintStatus;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Document.
 */
@Entity
@Table(name = "document")
@Cache(usage = CacheConcurrencyStrategy.NONE)
public class Document implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "creation", nullable = false)
    private ZonedDateTime creation;

    @Column(name = "impression")
    private ZonedDateTime impression;

    @Column(name = "motif")
    private String motif;

    @Column(name = "compteur")
    private long compteur;

    @Column(name = "printer")
    private String printer;

    @Enumerated(EnumType.STRING)
    @Column(name = "print_status")
    private PrintStatus printStatus;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "fichier" }, allowSetters = true)
    private Lot lot1;

    @ManyToOne
    @JsonIgnoreProperties(value = { "fichier" }, allowSetters = true)
    private Lot lot2;

    public long getCompteur() {
        return compteur;
    }

    public void setCompteur(long compteur) {
        this.compteur = compteur;
    }

    @ManyToOne(optional = true)
    // @NotNull
    @JsonIgnoreProperties(value = { "internalUser", "distributeur" }, allowSetters = true)
    private Poste poste;

    private String livraison;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getLivraison() {
        return livraison;
    }

    public void setLivraison(String livraison) {
        this.livraison = livraison;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Document id(Long id) {
        this.id = id;
        return this;
    }

    public String getMotif() {
        return motif;
    }

    public void setMotif(String motif) {
        this.motif = motif;
    }

    public ZonedDateTime getCreation() {
        return this.creation;
    }

    public Document creation(ZonedDateTime creation) {
        this.creation = creation;
        return this;
    }

    public void setCreation(ZonedDateTime creation) {
        this.creation = creation;
    }

    public ZonedDateTime getImpression() {
        return this.impression;
    }

    public Document impression(ZonedDateTime impression) {
        this.impression = impression;
        return this;
    }

    public void setImpression(ZonedDateTime impression) {
        this.impression = impression;
    }

    public String getPrinter() {
        return this.printer;
    }

    public Document printer(String printer) {
        this.printer = printer;
        return this;
    }

    public void setPrinter(String printer) {
        this.printer = printer;
    }

    public PrintStatus getPrintStatus() {
        return this.printStatus;
    }

    public Document printStatus(PrintStatus printStatus) {
        this.printStatus = printStatus;
        return this;
    }

    public void setPrintStatus(PrintStatus printStatus) {
        this.printStatus = printStatus;
    }

    public Lot getLot1() {
        return this.lot1;
    }

    public Document lot1(Lot lot) {
        this.setLot1(lot);
        return this;
    }

    public void setLot1(Lot lot) {
        this.lot1 = lot;
    }

    public Lot getLot2() {
        return this.lot2;
    }

    public Document lot2(Lot lot) {
        this.setLot2(lot);
        return this;
    }

    public void setLot2(Lot lot) {
        this.lot2 = lot;
    }

    public Poste getPoste() {
        return this.poste;
    }

    public Document poste(Poste poste) {
        this.setPoste(poste);
        return this;
    }

    public void setPoste(Poste poste) {
        this.poste = poste;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Document)) {
            return false;
        }
        return id != null && id.equals(((Document) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Document{" +
            "id=" + getId() +
            ", creation='" + getCreation() + "'" +
            ", impression='" + getImpression() + "'" +
            ", printer='" + getPrinter() + "'" +
            ", printStatus='" + getPrintStatus() + "'" +
            "}";
    }
}
