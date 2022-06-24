package com.inetum.voucher.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.inetum.voucher.domain.Poste} entity.
 */
public class PosteDTO implements Serializable {

    private Long id;

    @NotNull
    private String nom;

    @NotNull
    private String code;

    private String privateKey;

    private String publicKey;

    private String activationKey;

    private UserDTO internalUser;

    private DistributeurDTO distributeur;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getPrivateKey() {
        return privateKey;
    }

    public void setPrivateKey(String privateKey) {
        this.privateKey = privateKey;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }

    public UserDTO getInternalUser() {
        return internalUser;
    }

    public void setInternalUser(UserDTO internalUser) {
        this.internalUser = internalUser;
    }

    public DistributeurDTO getDistributeur() {
        return distributeur;
    }

    public void setDistributeur(DistributeurDTO distributeur) {
        this.distributeur = distributeur;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PosteDTO)) {
            return false;
        }

        PosteDTO posteDTO = (PosteDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, posteDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PosteDTO{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", code='" + getCode() + "'" +
            ", privateKey='" + getPrivateKey() + "'" +
            ", publicKey='" + getPublicKey() + "'" +
            ", internalUser=" + getInternalUser() +
            ", distributeur=" + getDistributeur() +
            "}";
    }

    public String getActivationKey() {
        return activationKey;
    }

    public void setActivationKey(String activationKey) {
        this.activationKey = activationKey;
    }
}
