package com.inetum.voucher.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Poste.
 */
@Entity
@Table(name = "poste")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Poste implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "nom", nullable = false, unique = true)
    private String nom;

    @NotNull
    @Column(name = "activationKey", nullable = false)
    private String activationKey;

    @NotNull
    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "private_key")
    private String privateKey;

    @Column(name = "public_key")
    private String publicKey;

    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private User internalUser;

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

    public Poste id(Long id) {
        this.id = id;
        return this;
    }

    public String getActivationKey() {
        return activationKey;
    }

    public void setActivationKey(String activationKey) {
        this.activationKey = activationKey;
    }

    public String getNom() {
        return this.nom;
    }

    public Poste nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getCode() {
        return this.code;
    }

    public Poste code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getPrivateKey() {
        return this.privateKey;
    }

    public Poste privateKey(String privateKey) {
        this.privateKey = privateKey;
        return this;
    }

    public void setPrivateKey(String privateKey) {
        this.privateKey = privateKey;
    }

    public String getPublicKey() {
        return this.publicKey;
    }

    public Poste publicKey(String publicKey) {
        this.publicKey = publicKey;
        return this;
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }

    public User getInternalUser() {
        return this.internalUser;
    }

    public Poste internalUser(User user) {
        this.setInternalUser(user);
        return this;
    }

    public void setInternalUser(User user) {
        this.internalUser = user;
    }

    public Distributeur getDistributeur() {
        return this.distributeur;
    }

    public Poste distributeur(Distributeur distributeur) {
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
        if (!(o instanceof Poste)) {
            return false;
        }
        return id != null && id.equals(((Poste) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Poste{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", code='" + getCode() + "'" +
            ", privateKey='" + getPrivateKey() + "'" +
            ", publicKey='" + getPublicKey() + "'" +
            "}";
    }
}
