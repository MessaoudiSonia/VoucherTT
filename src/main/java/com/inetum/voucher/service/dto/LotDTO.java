package com.inetum.voucher.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.inetum.voucher.domain.Lot} entity.
 */
public class LotDTO implements Serializable {

    private Long id;

    @NotNull
    @DecimalMin(value = "0")
    private Double offset;

    private String fichierPath;

    private FichierDTO fichier;

    public String getFichierPath() {
        return fichierPath;
    }

    public void setFichierPath(String fichierPath) {
        this.fichierPath = fichierPath;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getOffset() {
        return offset;
    }

    public void setOffset(Double offset) {
        this.offset = offset;
    }

    public FichierDTO getFichier() {
        return fichier;
    }

    public void setFichier(FichierDTO fichier) {
        this.fichier = fichier;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LotDTO)) {
            return false;
        }

        LotDTO lotDTO = (LotDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, lotDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LotDTO{" +
            "id=" + getId() +
            ", offset=" + getOffset() +
            ", fichier=" + getFichier() +
            "}";
    }
}
