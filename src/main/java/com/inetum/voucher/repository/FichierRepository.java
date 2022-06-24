package com.inetum.voucher.repository;

import com.inetum.voucher.domain.Document;
import com.inetum.voucher.domain.Fichier;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Fichier entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FichierRepository extends JpaRepository<Fichier, Long> {
    Optional<Fichier> findByDistributeurCode(String code);

    // Page<Fichier> findAllByPosteInternalUserLogin(String login, Pageable pageable);

    Optional<Fichier> findByPath(String path);
    Page<Fichier> findAllByDistributeurId(long id, Pageable pageable);
}
