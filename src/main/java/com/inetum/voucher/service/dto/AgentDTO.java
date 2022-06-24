package com.inetum.voucher.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.inetum.voucher.domain.Agent} entity.
 */
public class AgentDTO implements Serializable {

    private Long id;

    @NotNull
    private String matricule;

    private UserDTO internalUser;

    private String activationKey;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMatricule() {
        return matricule;
    }

    public void setMatricule(String matricule) {
        this.matricule = matricule;
    }

    public UserDTO getInternalUser() {
        return internalUser;
    }

    public void setInternalUser(UserDTO internalUser) {
        this.internalUser = internalUser;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AgentDTO)) {
            return false;
        }

        AgentDTO agentDTO = (AgentDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, agentDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AgentDTO{" +
            "id=" + getId() +
            ", matricule='" + getMatricule() + "'" +
            ", internalUser=" + getInternalUser() +
            "}";
    }

    public String getActivationKey() {
        return activationKey;
    }

    public void setActivationKey(String activationKey) {
        this.activationKey = activationKey;
    }
}
