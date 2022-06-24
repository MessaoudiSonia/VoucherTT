package com.inetum.voucher.repository;

import com.inetum.voucher.domain.Poste;
import java.nio.channels.FileChannel;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Poste entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PosteRepository extends JpaRepository<Poste, Long> {
    Poste findByInternalUser_Login(String currentUserLogin);

    List<Poste> findAllByDistributeurNom(String nom);
}
