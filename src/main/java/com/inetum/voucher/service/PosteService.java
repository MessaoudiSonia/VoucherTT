package com.inetum.voucher.service;

import com.inetum.voucher.service.dto.PosteDTO;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.inetum.voucher.domain.Poste}.
 */
public interface PosteService {
    /**
     * Save a poste.
     *
     * @param posteDTO the entity to save.
     * @return the persisted entity.
     */
    PosteDTO save(PosteDTO posteDTO) throws NoSuchAlgorithmException;

    /**
     * Partially updates a poste.
     *
     * @param posteDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<PosteDTO> partialUpdate(PosteDTO posteDTO);

    /**
     * Get all the postes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<PosteDTO> findAll(Pageable pageable);

    /**
     * Get the "id" poste.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<PosteDTO> findOne(Long id);

    /**
     * Get the "login" poste.
     *
     * @param login the id of the entity.
     * @return the entity.
     */
    //Optional<PosteDTO> findByUserLogin(String login);

    /**
     * Delete the "id" poste.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    String findByLogin(Optional<String> currentUserLogin);

    List<PosteDTO> findAllByDistributeur(String nom);
}
