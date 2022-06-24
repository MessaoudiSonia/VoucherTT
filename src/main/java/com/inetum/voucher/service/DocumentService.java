package com.inetum.voucher.service;

import com.inetum.voucher.domain.Document;
import com.inetum.voucher.domain.DocumentCriteria;
import com.inetum.voucher.domain.Fragment;
import com.inetum.voucher.domain.enumeration.PrintStatus;
import com.inetum.voucher.service.dto.DocumentDTO;
import com.inetum.voucher.service.impl.FileSourceService;
import com.inetum.voucher.service.util.EncryptedDoc;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.List;
import java.util.Optional;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.inetum.voucher.domain.Document}.
 */
public interface DocumentService {
    /**
     * Save a document.
     *
     * @param documentDTO the entity to save.
     * @return the persisted entity.
     */
    DocumentDTO save(DocumentDTO documentDTO);

    /**
     * Partially updates a document.
     *
     * @param documentDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<DocumentDTO> partialUpdate(DocumentDTO documentDTO);

    /**
     * Get all the documents.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<DocumentDTO> findAll(Pageable pageable);

    /**
     * Get the "id" document.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<DocumentDTO> findOne(Long id);

    /**
     * Delete the "id" document.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    List<FileSourceService.Record> generate(Long id) throws IOException, IllegalAccessException;

    byte[] recordListToBytes(List<FileSourceService.Record> list);

    List<Document> provisionNew(Integer number, Long fichierId, Boolean isDouble, String login, String livraison, String nomImprimante)
        throws IndexOutOfBoundsException;

    List<Document> provisionFailed(Integer maxNumber, Long fichierId, Boolean isDouble, String livraison) throws IndexOutOfBoundsException;

    List<EncryptedDoc> getEncryptedDocuments(
        Integer number,
        Long fichierId,
        Boolean isDouble,
        String login,
        Boolean recycle,
        String nomImprimante
    )
        throws NoSuchAlgorithmException, InvalidKeySpecException, IOException, IllegalAccessException, IllegalBlockSizeException, InvalidKeyException, NoSuchPaddingException, BadPaddingException;

    Page<DocumentDTO> findAllByCriteria(DocumentCriteria criteria, Pageable pageable);

    //    Page<Document> findByStatus(PrintStatus printStatus, Pageable pageable);
    Page<Document> findByPrintStatus(PrintStatus printStatus, Pageable pageable);

    List<DocumentDTO> findAllByPosteInternalUserLoginAndPrintStatus(String login, PrintStatus printStatus);

    void setDocumentSuccess(Long id, String printer);

    void setDocumentFailed(Long id, String printer);

    Long countRemainingNew(Long fichierId);

    EncryptedDoc getEncryptedDocument(Long id, String s)
        throws NoSuchAlgorithmException, InvalidKeySpecException, IOException, IllegalAccessException, IllegalBlockSizeException, InvalidKeyException, NoSuchPaddingException, BadPaddingException;

    List<DocumentDTO> findAllByPrintStatusNot(PrintStatus printStatus);
    List<DocumentDTO> findAllByPrintStatusNotAndPoste(PrintStatus printStatus, String user);

    Document concatTwoDocument50(Document document1, Document document2);

    List<Document> separateDocument100OftwoDocuments(Document document1);

    List<Fragment> groupedByOffset(int idFichier);

    List<DocumentDTO> findAllByPrintStatus(PrintStatus consumed);
    List<DocumentDTO> findByLivraisonAndPrintStatus(String livraison, PrintStatus printStatus);

    List<DocumentDTO> findAllByLivraison(String codeLivraison);
}
