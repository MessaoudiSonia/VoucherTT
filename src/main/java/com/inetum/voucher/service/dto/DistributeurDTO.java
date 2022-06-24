package com.inetum.voucher.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.inetum.voucher.domain.Distributeur} entity.
 */
public class DistributeurDTO implements Serializable {

    private Long id;

    @NotNull
    private String nom;

    @NotNull
    private String code;

    @NotNull
    private String codeReimpression;

    private String activationKey;

    private UserDTO internalUser;

    public String getActivationKey() {
        return activationKey;
    }

    public void setActivationKey(String activationKey) {
        this.activationKey = activationKey;
    }

    public UserDTO getInternalUser() {
        return internalUser;
    }

    public void setInternalUser(UserDTO internalUser) {
        this.internalUser = internalUser;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DistributeurDTO)) {
            return false;
        }

        DistributeurDTO distributeurDTO = (DistributeurDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, distributeurDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DistributeurDTO{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", code='" + getCode() + "'" +
            "}";
    }
}
