package com.inetum.voucher.service;

import com.inetum.voucher.domain.Document;
import com.inetum.voucher.domain.Historique;
import com.inetum.voucher.domain.HistoriqueCriteria;
import com.inetum.voucher.domain.enumeration.PrintStatus;
import com.inetum.voucher.service.dto.HistoriqueDTO;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Historique}.
 */
public interface HistoriqueService {
    /**
     * Save a historique.
     *
     * @param historiqueDTO the entity to save.
     * @return the persisted entity.
     */
    HistoriqueDTO save(HistoriqueDTO historiqueDTO);
    void createHistorique(Document document);
    /**
     * Partially updates a historique.
     *
     * @param historiqueDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<HistoriqueDTO> partialUpdate(HistoriqueDTO historiqueDTO);

    List<HistoriqueDTO> findAllHisto();

    /**
     * Get the "id" historique.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<HistoriqueDTO> findOne(Long id);

    /**
     * Delete the "id" historique.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    List<HistoriqueDTO> findAllByPoste(String userName);

    Page<HistoriqueDTO> findAllByCriteria(HistoriqueCriteria criteria, Pageable pageable);
    List<HistoriqueDTO> findAllByPrintStatusNotAndPoste(PrintStatus printStatus, String userName);
}
