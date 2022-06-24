package com.inetum.voucher.repository;

import com.inetum.voucher.domain.Lot;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Lot entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LotRepository extends JpaRepository<Lot, Long> {
    Optional<Lot> findTopByFichierIdOrderByOffsetDesc(Long fichierId);
}
