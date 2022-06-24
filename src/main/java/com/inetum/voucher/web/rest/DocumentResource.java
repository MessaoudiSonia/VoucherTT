package com.inetum.voucher.web.rest;

import com.inetum.voucher.domain.Document;
import com.inetum.voucher.domain.DocumentCriteria;
import com.inetum.voucher.domain.Fragment;
import com.inetum.voucher.domain.enumeration.PrintStatus;
import com.inetum.voucher.repository.DocumentRepository;
import com.inetum.voucher.repository.FragmentJDBCTemplate;
import com.inetum.voucher.repository.PosteRepository;
import com.inetum.voucher.security.AuthoritiesConstants;
import com.inetum.voucher.security.SecurityUtils;
import com.inetum.voucher.service.DocumentService;
import com.inetum.voucher.service.PosteService;
import com.inetum.voucher.service.RSAService;
import com.inetum.voucher.service.dto.DocumentDTO;
import com.inetum.voucher.service.impl.HistoriqueServiceImpl;
import com.inetum.voucher.service.util.EncryptedDoc;
import com.inetum.voucher.web.rest.errors.BadRequestAlertException;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.AccessDeniedException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.*;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.print.DocFlavor;
import javax.print.PrintService;
import javax.print.PrintServiceLookup;
import javax.print.attribute.HashPrintRequestAttributeSet;
import javax.print.attribute.PrintRequestAttributeSet;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.inetum.voucher.domain.Document}.
 */
@RestController
@RequestMapping("/api")
public class DocumentResource {

    @Autowired
    private FragmentJDBCTemplate fragmentJDBCTemplate;

    private final Logger log = LoggerFactory.getLogger(DocumentResource.class);

    private static final String ENTITY_NAME = "document";

    private final HistoriqueServiceImpl historiqueServiceImpl;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Value("${droit.timbre}")
    private String droitTimbre;

    public String getDroitTimbre() {
        return droitTimbre;
    }

    private final DocumentService documentService;

    private final DocumentRepository documentRepository;
    private final RSAService rsaService;
    private final PosteRepository posteRepository;
    private final PosteService posteService;

    public DocumentResource(
        HistoriqueServiceImpl historiqueServiceImpl,
        DocumentService documentService,
        DocumentRepository documentRepository,
        RSAService rsaService,
        PosteRepository posteRepository,
        PosteService posteService
    ) {
        this.historiqueServiceImpl = historiqueServiceImpl;
        this.documentService = documentService;
        this.documentRepository = documentRepository;
        this.rsaService = rsaService;
        this.posteRepository = posteRepository;
        this.posteService = posteService;
    }

    /**
     * {@code POST  /documents} : Create a new document.
     *
     * @param documentDTO the documentDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new documentDTO, or with status {@code 400 (Bad Request)} if the document has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.POSTE, AuthoritiesConstants.DISTRIBUTEUR })
    @PostMapping("/documents")
    public ResponseEntity<DocumentDTO> createDocument(@Valid @RequestBody DocumentDTO documentDTO) throws URISyntaxException {
        log.debug("REST request to save Document : {}", documentDTO);
        if (documentDTO.getId() != null) {
            throw new BadRequestAlertException("A new document cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DocumentDTO result = documentService.save(documentDTO);
        return ResponseEntity
            .created(new URI("/api/documents/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /documents/:id} : Updates an existing document.
     *
     * @param id the id of the documentDTO to save.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated documentDTO,
     * or with status {@code 400 (Bad Request)} if the documentDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the documentDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @Secured({ AuthoritiesConstants.POSTE, AuthoritiesConstants.DISTRIBUTEUR })
    @PutMapping("/documents/{id}/{status}")
    public ResponseEntity<DocumentDTO> updateDocumentStatus(
        @PathVariable(value = "id", required = false) final Long id,
        @PathVariable(value = "status", required = true) final PrintStatus status
    ) throws URISyntaxException, AccessDeniedException {
        log.debug("REST request to update Document : {}", id);
        if (id == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        DocumentDTO documentDTO = documentService.findOne(id).get();

        if (!documentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        String user = SecurityUtils.getCurrentUserLogin().get();

        if (
            documentDTO.getPoste() != null ||
            documentDTO.getPoste().getInternalUser() == null ||
            StringUtils.equals(documentDTO.getPoste().getInternalUser().getLogin(), SecurityUtils.getCurrentUserLogin().get())
        ) {
            throw new AccessDeniedException("", "Access denied", "Vous n'avez pas le droit de consulter cette page");
        }

        if (status != PrintStatus.FAILED && status != PrintStatus.CONSUMED) {
            throw new BadRequestAlertException("Invalid Status", ENTITY_NAME, "idnull");
        }
        if (documentDTO.getPrintStatus() != PrintStatus.SENT) {
            throw new BadRequestAlertException("Invalid Status", ENTITY_NAME, "idnull");
        }

        documentDTO.setPrintStatus(status);

        DocumentDTO result = documentService.save(documentDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, documentDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /documents/:id} : Partial updates given fields of an existing document, field will ignore if it is null
     *
     * @param id the id of the documentDTO to save.
     * @param documentDTO the documentDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated documentDTO,
     * or with status {@code 400 (Bad Request)} if the documentDTO is not valid,
     * or with status {@code 404 (Not Found)} if the documentDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the documentDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @Secured({ AuthoritiesConstants.IGNORE })
    @PatchMapping(value = "/documents/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<DocumentDTO> partialUpdateDocument(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DocumentDTO documentDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Document partially : {}, {}", id, documentDTO);
        if (documentDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, documentDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!documentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DocumentDTO> result = documentService.partialUpdate(documentDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, documentDTO.getId().toString())
        );
    }

    @Secured({ AuthoritiesConstants.POSTE, AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.DISTRIBUTEUR })
    @PutMapping(value = "/documents/{id}")
    public ResponseEntity<DocumentDTO> partialUpdateDocumentPut(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DocumentDTO documentDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Document partially : {}, {}", id, documentDTO);
        if (documentDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, documentDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!documentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DocumentDTO> result = documentService.partialUpdate(documentDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, documentDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /documents} : get all the documents.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of documents in body.
     */
    @Secured({ AuthoritiesConstants.POSTE, AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.DISTRIBUTEUR })
    @GetMapping("/documents")
    public ResponseEntity<List<DocumentDTO>> getAllDocuments(Pageable pageable) {
        log.debug("REST request to get a page of Documents");
        Page<DocumentDTO> page = documentService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @Secured({ AuthoritiesConstants.POSTE, AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.DISTRIBUTEUR })
    @GetMapping("/documents/historique")
    public ResponseEntity<List<DocumentDTO>> getAllDocumentsHistorique() {
        log.debug("REST request to get a page of Documents");

        List<DocumentDTO> listeDoc = documentService.findAllByPrintStatusNot(PrintStatus.NEW);

        return ResponseEntity.ok().body(listeDoc);
    }

    @Secured({ AuthoritiesConstants.POSTE, AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.DISTRIBUTEUR })
    @GetMapping("/documents/historiqueByPoste")
    public ResponseEntity<List<DocumentDTO>> getAllDocumentsHistoriqueByPoste() {
        log.debug("REST request to get a page of Documents");
        String user = SecurityUtils.getCurrentUserLogin().get();

        List<DocumentDTO> listeDoc = documentService.findAllByPrintStatusNotAndPoste(PrintStatus.SENT, user);

        return ResponseEntity.ok().body(listeDoc);
    }

    /*   *//**
     * {@code GET  /documents} : get number of encrypted documents.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of encrypted documents in body.
     */
    @Secured({ AuthoritiesConstants.POSTE, AuthoritiesConstants.DISTRIBUTEUR })
    @GetMapping("/documents/{number}/{isDouble}/{fichierId}")
    public ResponseEntity<List<EncryptedDoc>> getNDocuments(
        @PathVariable Integer number,
        @PathVariable String isDouble,
        @PathVariable Long fichierId,
        @RequestParam String nomImprimante
    ) {
        boolean isDouble1 = Boolean.parseBoolean(isDouble);
        log.debug("REST request to get a page of Documents");
        List<EncryptedDoc> documents;
        try {
            documents =
                documentService.getEncryptedDocuments(
                    number,
                    fichierId,
                    isDouble1,
                    SecurityUtils.getCurrentUserLogin().get(),
                    false,
                    nomImprimante
                );
        } catch (NoSuchAlgorithmException e) {
            log.error("NoSuchAlgorithmException:%", e.getLocalizedMessage());
            return ResponseEntity.badRequest().build();
        } catch (InvalidKeySpecException e) {
            log.error("InvalidKeySpecException:%", e.getLocalizedMessage());
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            log.error("IOException:%", e.getLocalizedMessage());
            return ResponseEntity.badRequest().build();
        } catch (IllegalAccessException e) {
            log.error("IllegalAccessException:%", e.getLocalizedMessage());
            return ResponseEntity.badRequest().build();
        } catch (IllegalBlockSizeException e) {
            log.error("IllegalBlockSizeException:%", e.getLocalizedMessage());
            return ResponseEntity.badRequest().build();
        } catch (InvalidKeyException e) {
            log.error("InvalidKeyException:%", e.getLocalizedMessage());
            return ResponseEntity.badRequest().build();
        } catch (NoSuchPaddingException e) {
            log.error("NoSuchPaddingException:%", e.getLocalizedMessage());
            return ResponseEntity.badRequest().build();
        } catch (BadPaddingException e) {
            log.error("BadPaddingException:%", e.getLocalizedMessage());
            return ResponseEntity.badRequest().build();
        }

        //        List<DocumentDTO> documents = documentService.provisionNew(number,isDouble);
        return ResponseEntity.ok().body(documents);
    }

    /**
     * {@code GET  /documents/:id} : get the "id" document.
     *
     * @param id the id of the documentDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the documentDTO, or with status {@code 404 (Not Found)}.
     */
    @Secured({ AuthoritiesConstants.POSTE, AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.DISTRIBUTEUR })
    @GetMapping("/documents/{id}")
    public ResponseEntity<DocumentDTO> getDocument(@PathVariable Long id) {
        log.debug("REST request to get Document : {}", id);
        Optional<DocumentDTO> documentDTO = documentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(documentDTO);
    }

    /**
     * {@code GET  /documents/:id/printable} : get the "id" document in a printable format.
     *
     * @param id the id of the documentDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body document in a encrypted printable format, or with status {@code 404 (Not Found)}.
     */
    /*    @GetMapping("/documents/{id}/printable")
    @Secured("ROLE_POSTE")
    public ResponseEntity<String> getPritableDocument(@PathVariable Long id, Principal principal) throws IOException {
        log.debug("REST request to get Document : {}", id);

        List<FileSourceService.Record> records= documentService.generate(id);
byte[] payload=documentService.recordListToBytes(records);

        String login=principal.getName();
        Poste poste = posteRepository.findByLogin(login);

        Optional<String> resp=Optional.of(aESService.encrypt(Base64.getEncoder().encodeToString(payload), new SecretKey(poste.getCryptoKey().getBytes()),null));
        return ResponseUtil.wrapOrNotFound(Optional<resp>);
    }*/

    /**
     * {@code DELETE  /documents/:id} : delete the "id" document.
     *
     * @param id the id of the documentDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/documents/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        log.debug("REST request to delete Document : {}", id);
        documentService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @PostMapping(value = "/documents/query")
    public ResponseEntity<List<DocumentDTO>> query(
        @RequestBody DocumentCriteria criteria,
        @PageableDefault(size = 10000) Pageable pageable
    ) {
        log.debug("REST request to find by criteria Local : {}", criteria.toString());
        System.out.println(criteria);
        String login = null;
        Page<DocumentDTO> page = documentService.findAllByCriteria(criteria, pageable);
        System.out.println(page.getContent());
        //HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page);
        return ResponseEntity.ok().body(page.getContent());
    }

    //    @Secured({ AuthoritiesConstants.POSTE, AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER })
    //    @GetMapping("/documents/status")
    //    public ResponseEntity<List<DocumentDTO>> getAllDocuments(PrintStatus printStatus,Pageable pageable) {
    //        log.debug("REST request to get a page of Documents");
    //        Page<DocumentDTO> page = documentService.findByStatus(printStatus,pageable);
    //        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
    //        return ResponseEntity.ok().headers(headers).body(page.getContent());
    //    }

    //    @GetMapping("/documents/status/{printStatus}")
    //    public ResponseEntity<List<Document>> getAllDocuments(@PathVariable PrintStatus printStatus, Pageable pageable) {
    //
    //        Page<Document> page = documentService.findByStatus(printStatus,pageable);
    //        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
    //        return ResponseEntity.ok().headers(headers).body(page.getContent());
    //
    //    }

    @Secured({ AuthoritiesConstants.POSTE, AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.DISTRIBUTEUR })
    @GetMapping("/documents/printStatus/{printStatus}")
    public ResponseEntity<List<Document>> getAllDocumentsByPrintStatus(@PathVariable PrintStatus printStatus, Pageable pageable) {
        Page<Document> page = documentService.findByPrintStatus(printStatus, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @Secured({ AuthoritiesConstants.POSTE, AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.DISTRIBUTEUR })
    @GetMapping("/documents/Failed")
    public ResponseEntity<List<DocumentDTO>> getAllDocumentsByPosteAndFailed() {
        log.debug("REST request to get a page of Documents");
        String login = null;
        PrintStatus printStatus = null;
        List<DocumentDTO> listes = documentService.findAllByPosteInternalUserLoginAndPrintStatus(login, printStatus);

        return ResponseEntity.ok().body(listes);
    }

    @Secured({ AuthoritiesConstants.POSTE, AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.DISTRIBUTEUR })
    @GetMapping("/documents/imprimantes")
    public List<String> getAllPrinters() {
        List<String> listeNomImprimantes = new ArrayList<String>();
        log.debug("REST request to get imprimantes");
        PrintRequestAttributeSet requestAttributeSet = new HashPrintRequestAttributeSet();
        PrintService[] services = PrintServiceLookup.lookupPrintServices(DocFlavor.INPUT_STREAM.PNG, requestAttributeSet);
        for (PrintService service1 : services) {
            listeNomImprimantes.add(service1.getName());
        }
        return listeNomImprimantes;
    }

    @Secured({ AuthoritiesConstants.POSTE, AuthoritiesConstants.DISTRIBUTEUR })
    @GetMapping("/documents/success/{id}")
    public ResponseEntity<Void> setPrintSuccess(@PathVariable Long id, @RequestParam String nomImprimante) {
        documentService.setDocumentSuccess(id, nomImprimante);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @Secured({ AuthoritiesConstants.POSTE, AuthoritiesConstants.DISTRIBUTEUR })
    @GetMapping("/documents/failed/{id}")
    public ResponseEntity<Void> setPrintFailure(@PathVariable Long id, @RequestParam String nomImprimante) {
        documentService.setDocumentFailed(id, nomImprimante);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /*   *//**
     * {@code GET  /documents} : get number of encrypted documents.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of encrypted documents in body.
     */
    @Secured({ AuthoritiesConstants.POSTE, AuthoritiesConstants.DISTRIBUTEUR })
    @GetMapping("/documents/{id}/failed")
    public ResponseEntity<EncryptedDoc> getFailedDocument(@PathVariable Long id) {
        log.debug("REST request to get an encrypted Failed  Document");
        EncryptedDoc document;
        try {
            document = documentService.getEncryptedDocument(id, SecurityUtils.getCurrentUserLogin().get());
        } catch (NoSuchAlgorithmException e) {
            log.error("NoSuchAlgorithmException:%", e.getLocalizedMessage());
            return ResponseEntity.badRequest().build();
        } catch (InvalidKeySpecException e) {
            log.error("InvalidKeySpecException:%", e.getLocalizedMessage());
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            log.error("IOException:%", e.getLocalizedMessage());
            return ResponseEntity.badRequest().build();
        } catch (IllegalAccessException e) {
            log.error("IllegalAccessException:%", e.getLocalizedMessage());
            return ResponseEntity.badRequest().build();
        } catch (IllegalBlockSizeException e) {
            log.error("IllegalBlockSizeException:%", e.getLocalizedMessage());
            return ResponseEntity.badRequest().build();
        } catch (InvalidKeyException e) {
            log.error("InvalidKeyException:%", e.getLocalizedMessage());
            return ResponseEntity.badRequest().build();
        } catch (NoSuchPaddingException e) {
            log.error("NoSuchPaddingException:%", e.getLocalizedMessage());
            return ResponseEntity.badRequest().build();
        } catch (BadPaddingException e) {
            log.error("BadPaddingException:%", e.getLocalizedMessage());
            return ResponseEntity.badRequest().build();
        }
        //        List<DocumentDTO> documents = documentService.provisionNew(number,isDouble);
        return ResponseEntity.ok().body(document);
    }

    @Secured({ AuthoritiesConstants.POSTE, AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.DISTRIBUTEUR })
    @GetMapping("/documents/groupedByOffset/{idFichier}")
    @Transactional
    public ResponseEntity<List<Fragment>> groupedByOffset(@PathVariable int idFichier) {
        log.debug("REST Grouped By Offset");
        List<Fragment> liste = documentService.groupedByOffset(idFichier);
        return ResponseEntity.ok().body(liste);
    }

    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.POSTE, AuthoritiesConstants.DISTRIBUTEUR })
    @GetMapping("/documents/droitTimbre")
    public String getDroit() {
        System.out.print("droit de timbre" + droitTimbre);
        return getDroitTimbre();
    }

    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.POSTE, AuthoritiesConstants.DISTRIBUTEUR })
    @GetMapping("/documents/uuid/{codeLivraison}")
    public ResponseEntity<List<EncryptedDoc>> getAllDocsByCodeLivraison(@PathVariable String codeLivraison) {
        List<EncryptedDoc> documents = new ArrayList<>();
        List<DocumentDTO> listeDoc = documentService.findAllByLivraison(codeLivraison);
        for (DocumentDTO data : listeDoc) {
            try {
                documents.add(documentService.getEncryptedDocument(data.getId(), SecurityUtils.getCurrentUserLogin().get()));
            } catch (NoSuchAlgorithmException e) {
                e.printStackTrace();
            } catch (InvalidKeySpecException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (IllegalBlockSizeException e) {
                e.printStackTrace();
            } catch (InvalidKeyException e) {
                e.printStackTrace();
            } catch (NoSuchPaddingException e) {
                e.printStackTrace();
            } catch (BadPaddingException e) {
                e.printStackTrace();
            }
        }

        return ResponseEntity.ok().body(documents);
    }
}
