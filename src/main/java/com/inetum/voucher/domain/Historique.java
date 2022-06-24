package com.inetum.voucher.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.inetum.voucher.domain.enumeration.PrintStatus;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Document.
 */
@Entity
@Table(name = "historique")
@Cache(usage = CacheConcurrencyStrategy.NONE)
public class Historique implements Serializable {

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

    @Column(name = "printer")
    private String printer;

    @Enumerated(EnumType.STRING)
    @Column(name = "print_status")
    private PrintStatus printStatus;

    @ManyToOne(optional = true)
    private Document document;

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

    public Historique id(Long id) {
        this.id = id;
        return this;
    }

    public ZonedDateTime getCreation() {
        return this.creation;
    }

    public Historique creation(ZonedDateTime creation) {
        this.creation = creation;
        return this;
    }

    public void setCreation(ZonedDateTime creation) {
        this.creation = creation;
    }

    public ZonedDateTime getImpression() {
        return this.impression;
    }

    public Historique impression(ZonedDateTime impression) {
        this.impression = impression;
        return this;
    }

    public void setImpression(ZonedDateTime impression) {
        this.impression = impression;
    }

    public String getPrinter() {
        return this.printer;
    }

    public Historique printer(String printer) {
        this.printer = printer;
        return this;
    }

    public void setPrinter(String printer) {
        this.printer = printer;
    }

    public PrintStatus getPrintStatus() {
        return this.printStatus;
    }

    public Historique printStatus(PrintStatus printStatus) {
        this.printStatus = printStatus;
        return this;
    }

    public void setPrintStatus(PrintStatus printStatus) {
        this.printStatus = printStatus;
    }

    public Document getDocument() {
        return this.document;
    }

    public Historique document(Document document) {
        this.setDocument(document);
        return this;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Historique)) {
            return false;
        }
        return id != null && id.equals(((Historique) o).id);
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
