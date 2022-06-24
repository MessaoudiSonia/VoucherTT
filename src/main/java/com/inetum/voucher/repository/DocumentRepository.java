package com.inetum.voucher.repository;

import com.inetum.voucher.domain.Document;
import com.inetum.voucher.domain.enumeration.PrintStatus;
import java.nio.channels.FileChannel;
import java.time.ZonedDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

@SuppressWarnings("unused")
@Repository
public interface DocumentRepository extends JpaRepository<Document, Long>, JpaSpecificationExecutor<Document> {
    Page<Document> findAllByPosteInternalUserLogin(String login, Pageable pageable);
    List<Document> findByLot1FichierIdAndPrintStatusAndLot2NotNull(Long fichierId, PrintStatus printStatus, Pageable pageable);
    List<Document> findByLot1FichierIdAndPrintStatusAndLot2IsNull(Long fichierId, PrintStatus printStatus, Pageable pageable);
    Page<Document> findByPrintStatus(PrintStatus printStatus, Pageable pageable);
    //    Page<Document> queryAllByPosteInternalUserLogin(Specification<Document> spec,String login,  Pageable pageable);
    List<Document> findAllByPosteInternalUserLoginAndPrintStatus(String login, PrintStatus printStatus);
    List<Document> findByLivraisonAndPrintStatus(String livraison, PrintStatus printStatus);
    List<Document> findByCreationBeforeAndPrintStatus(ZonedDateTime creation, PrintStatus printStatus);
    Long countByPrintStatusAndLot1FichierIdAndLot2NotNull(PrintStatus printStatus, Long fichierId);
    Long countByPrintStatusAndLot1FichierIdAndLot2IsNull(PrintStatus printStatus, Long fichierId);

    List<Document> findAllByPrintStatusNot(PrintStatus printStatus);

    List<Document> findAllByPrintStatus(PrintStatus printStatus);

    List<Document> findAllByLivraison(String codeLivraison);

    List<Document> findAllByPrintStatusNotAndPosteId(PrintStatus printStatus, Long posteId);
    //    @Query(value = "SELECT COUNT(IDD),LIVRAISON, PRINT_STATUS, MIN(INETUM_OFFSET) as START,(MAX(INETUM_OFFSET)+50) as STOP, CREATION,IMPRESSION,PRINTER,POSTE_ID FROM (SELECT DOCUMENT.ID as IDD, LOT.ID as IDL,INETUM_OFFSET, FICHIER_ID,CREATION,IMPRESSION,PRINTER,PRINT_STATUS,POSTE_ID,LIVRAISON FROM LOT INNER JOIN DOCUMENT ON DOCUMENT.LOT1_ID= LOT.ID OR DOCUMENT.LOT2_ID= LOT.ID WHERE FICHIER_ID =:idFichier) GROUP BY LIVRAISON,IDD ORDER BY START", nativeQuery = true)
    //    List<FragmentDTO>groupedByOffset(@Param("idFichier") int  idFichier);

}
