package com.inetum.voucher.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Distributeur.
 */
@Entity
@Table(name = "distributeur")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Distributeur implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "nom", nullable = false, unique = true)
    private String nom;

    @NotNull
    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @NotNull
    @Column(name = "activationKey", nullable = false)
    private String activationKey;

    @OneToOne(optional = false)
    @JoinColumn(unique = true)
    private User internalUser;

    @NotNull
    @Column(name = "codeReimpression", nullable = false, unique = true)
    private String codeReimpression;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getActivationKey() {
        return activationKey;
    }

    public void setActivationKey(String activationKey) {
        this.activationKey = activationKey;
    }

    public String getCodeReimpression() {
        return codeReimpression;
    }

    public void setCodeReimpression(String codeReimpression) {
        this.codeReimpression = codeReimpression;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Distributeur id(Long id) {
        this.id = id;
        return this;
    }

    public String getNom() {
        return this.nom;
    }

    public Distributeur nom(String nom) {
        this.nom = nom;
        return this;
    }

    public User getInternalUser() {
        return internalUser;
    }

    public void setInternalUser(User internalUser) {
        this.internalUser = internalUser;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getCode() {
        return this.code;
    }

    public Distributeur code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Distributeur)) {
            return false;
        }
        return id != null && id.equals(((Distributeur) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Distributeur{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", code='" + getCode() + "'" +
            "}";
    }
}
