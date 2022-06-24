package com.inetum.voucher.service.dto;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.inetum.voucher.domain.Fichier} entity.
 */
public class FichierDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(min = 8)
    private String path;

    //  @NotNull
    //  @Min(value = 50L)
    private Long count;

    @NotNull
    @Size(min = 3)
    private String password;

    private DistributeurDTO distributeur;

    private ZonedDateTime ouverture;

    public ZonedDateTime getOuverture() {
        return ouverture;
    }

    public void setOuverture(ZonedDateTime ouverture) {
        this.ouverture = ouverture;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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
        if (!(o instanceof FichierDTO)) {
            return false;
        }

        FichierDTO fichierDTO = (FichierDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, fichierDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FichierDTO{" +
            "id=" + getId() +
            ", path='" + getPath() + "'" +
            ", count=" + getCount() +
            ", password='" + getPassword() + "'" +
            ", distributeur=" + getDistributeur() +
            "}";
    }
}
