package com.inetum.voucher.service;

import com.inetum.voucher.domain.Lot;
import com.inetum.voucher.service.dto.LotDTO;
import java.io.FileNotFoundException;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.inetum.voucher.domain.Lot}.
 */
public interface LotService {
    /**
     * Save a lot.
     *
     * @param lotDTO the entity to save.
     * @return the persisted entity.
     */
    LotDTO save(LotDTO lotDTO);

    /**
     * Partially updates a lot.
     *
     * @param lotDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<LotDTO> partialUpdate(LotDTO lotDTO);

    /**
     * Get all the lots.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<LotDTO> findAll(Pageable pageable);

    /**
     * Get the "id" lot.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<LotDTO> findOne(Long id);

    /**
     * Delete the "id" lot.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    Lot createnew(Long fichierId) throws FileNotFoundException;
}
