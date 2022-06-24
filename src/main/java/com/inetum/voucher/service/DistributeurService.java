package com.inetum.voucher.service;

import com.inetum.voucher.service.dto.DistributeurDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.inetum.voucher.domain.Distributeur}.
 */
public interface DistributeurService {
    /**
     * Save a distributeur.
     *
     * @param distributeurDTO the entity to save.
     * @return the persisted entity.
     */
    DistributeurDTO save(DistributeurDTO distributeurDTO);

    /**
     * Partially updates a distributeur.
     *
     * @param distributeurDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<DistributeurDTO> partialUpdate(DistributeurDTO distributeurDTO);

    /**
     * Get all the distributeurs.
     *
     * @return the list of entities.
     */
    List<DistributeurDTO> findAll();

    /**
     * Get the "id" distributeur.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<DistributeurDTO> findOne(Long id);

    /**
     * Delete the "id" distributeur.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
