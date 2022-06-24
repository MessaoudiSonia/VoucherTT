package com.inetum.voucher.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Lot.
 */
@Entity
@Table(name = "lot")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Lot implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @DecimalMin(value = "0")
    @Column(name = "inetum_offset", nullable = false)
    private Double offset;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "distributeur" }, allowSetters = true)
    private Fichier fichier;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Lot id(Long id) {
        this.id = id;
        return this;
    }

    public Double getOffset() {
        return this.offset;
    }

    public Lot offset(Double offset) {
        this.offset = offset;
        return this;
    }

    public void setOffset(Double offset) {
        this.offset = offset;
    }

    public Fichier getFichier() {
        return this.fichier;
    }

    public Lot fichier(Fichier fichier) {
        this.setFichier(fichier);
        return this;
    }

    public void setFichier(Fichier fichier) {
        this.fichier = fichier;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Lot)) {
            return false;
        }
        return id != null && id.equals(((Lot) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Lot{" +
            "id=" + getId() +
            ", offset=" + getOffset() +
            "}";
    }
}
