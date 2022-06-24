package com.inetum.voucher.service;

import com.inetum.voucher.domain.Fichier;
import com.inetum.voucher.service.dto.FichierDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.inetum.voucher.domain.Fichier}.
 */
public interface FichierService {
    /**
     * Save a fichier.
     *
     * @param fichierDTO the entity to save.
     * @return the persisted entity.
     */
    FichierDTO save(FichierDTO fichierDTO);

    /**
     * Partially updates a fichier.
     *
     * @param fichierDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<FichierDTO> partialUpdate(FichierDTO fichierDTO);

    /**
     * Get all the fichiers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<FichierDTO> findAll(Pageable pageable);

    /**
     * Get the "id" fichier.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<FichierDTO> findOne(Long id);

    /**
     * Delete the "id" fichier.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    Double nextOffset(Long ficherId);
}
