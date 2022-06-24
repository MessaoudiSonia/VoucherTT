package com.inetum.voucher.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Fichier.
 */
@Entity
@Table(name = "fichier")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Fichier implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Size(min = 8)
    @Column(name = "path", nullable = false, unique = true)
    private String path;

    @Column(name = "ouverture")
    private ZonedDateTime ouverture;

    //  @NotNull
    //  @Min(value = 50L)
    @Column(name = "count", nullable = true)
    private Long count;

    //  @NotNull
    //  @Size(min = 3)
    @Column(name = "password", nullable = true)
    private String password;

    @ManyToOne(optional = false)
    @NotNull
    private Distributeur distributeur;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Fichier id(Long id) {
        this.id = id;
        return this;
    }

    public ZonedDateTime getOuverture() {
        return ouverture;
    }

    public void setOuverture(ZonedDateTime ouverture) {
        this.ouverture = ouverture;
    }

    public String getPath() {
        return this.path;
    }

    public Fichier path(String path) {
        this.path = path;
        return this;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Long getCount() {
        return this.count;
    }

    public Fichier count(Long count) {
        this.count = count;
        return this;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    public String getPassword() {
        return this.password;
    }

    public Fichier password(String password) {
        this.password = password;
        return this;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Distributeur getDistributeur() {
        return this.distributeur;
    }

    public Fichier distributeur(Distributeur distributeur) {
        this.setDistributeur(distributeur);
        return this;
    }

    public void setDistributeur(Distributeur distributeur) {
        this.distributeur = distributeur;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Fichier)) {
            return false;
        }
        return id != null && id.equals(((Fichier) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Fichier{" +
            "id=" + getId() +
            ", path='" + getPath() + "'" +
            ", count=" + getCount() +
            ", password='" + getPassword() + "'" +
            "}";
    }
}
