package com.inetum.voucher.repository;

import com.inetum.voucher.domain.Distributeur;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Distributeur entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DistributeurRepository extends JpaRepository<Distributeur, Long> {
    Optional<Distributeur> findByCode(String dir);

}
