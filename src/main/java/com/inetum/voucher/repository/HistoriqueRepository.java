package com.inetum.voucher.repository;

import com.inetum.voucher.domain.Document;
import com.inetum.voucher.domain.Historique;
import com.inetum.voucher.domain.enumeration.PrintStatus;
import java.time.ZonedDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoriqueRepository extends JpaRepository<Historique, Long>, JpaSpecificationExecutor<Historique> {
    List<Historique> findAllByDocumentPosteId(Long id);

    List<Historique> findAllByDocumentPosteIdOrderByCreationDesc(Long id);

    List<Historique> findAllByPrintStatusNot(PrintStatus printStatus);
    List<Historique> findAllByPrintStatusNotAndDocumentPosteId(PrintStatus printStatus, Long posteId);
}
