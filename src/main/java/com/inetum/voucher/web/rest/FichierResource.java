package com.inetum.voucher.web.rest;

import com.inetum.voucher.domain.*;
import com.inetum.voucher.domain.enumeration.PrintStatus;
import com.inetum.voucher.repository.*;
import com.inetum.voucher.security.AuthoritiesConstants;
import com.inetum.voucher.security.SecurityUtils;
import com.inetum.voucher.service.DocumentService;
import com.inetum.voucher.service.FichierService;
import com.inetum.voucher.service.dto.DocumentDTO;
import com.inetum.voucher.service.dto.FichierDTO;
import com.inetum.voucher.service.impl.FileSourceService;
import com.inetum.voucher.service.mapper.FichierMapper;
import com.inetum.voucher.web.rest.errors.BadRequestAlertException;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.inetum.voucher.domain.Fichier}.
 */
@RestController
@RequestMapping("/api")
public class FichierResource {

    private final Logger log = LoggerFactory.getLogger(FichierResource.class);

    private static final String ENTITY_NAME = "fichier";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FichierService fichierService;

    private final FichierRepository fichierRepository;

    private final LotRepository lotRepository;

    private final UserRepository userRepository;

    private final PosteRepository posteRepository;

    private final DocumentRepository documentRepository;

    private final FileSourceService fileSourceService;

    private final FichierMapper fichierMapper;

    private final DocumentService documentService;

    public FichierResource(
        FichierService fichierService,
        FichierRepository fichierRepository,
        LotRepository lotRepository,
        FileSourceService fileSourceService,
        UserRepository userRepository,
        FichierMapper fichierMapper,
        PosteRepository posteRepository,
        DocumentService documentService,
        DocumentRepository documentRepository
    ) {
        this.fichierService = fichierService;
        this.fichierRepository = fichierRepository;
        this.lotRepository = lotRepository;
        this.fileSourceService = fileSourceService;
        this.userRepository = userRepository;
        this.fichierMapper = fichierMapper;
        this.posteRepository = posteRepository;
        this.documentService = documentService;
        this.documentRepository = documentRepository;
    }

    /**
     * {@code POST  /fichiers} : Create a new fichier.
     *
     * @param fichierDTO the fichierDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new fichierDTO, or with status {@code 400 (Bad Request)} if the fichier has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER })
    @PostMapping("/fichiers")
    public ResponseEntity<FichierDTO> createFichier(@Valid @RequestBody FichierDTO fichierDTO) throws URISyntaxException {
        log.debug("REST request to save Fichier : {}", fichierDTO);
        if (fichierDTO.getId() != null) {
            throw new BadRequestAlertException("A new fichier cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FichierDTO result = fichierService.save(fichierDTO);
        return ResponseEntity
            .created(new URI("/api/fichiers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /fichiers/:id} : Updates an existing fichier.
     *
     * @param id         the id of the fichierDTO to save.
     * @param fichierDTO the fichierDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fichierDTO,
     * or with status {@code 400 (Bad Request)} if the fichierDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the fichierDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.POSTE })
    @PutMapping("/fichiers/{id}")
    public ResponseEntity<FichierDTO> updateFichier(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody FichierDTO fichierDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Fichier : {}, {}", id, fichierDTO);
        if (fichierDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fichierDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fichierRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        try {
            int count = fileSourceService.countRecords(fichierDTO.getPath(), fichierDTO.getPassword());
            fichierDTO.setCount(Long.valueOf(count));
            fichierDTO.setOuverture(ZonedDateTime.now());
        } catch (IllegalAccessException e) {
            log.error("IllegalAccess:%", e.getLocalizedMessage());
            throw new BadRequestAlertException("Too many files in zip", ENTITY_NAME, "toomanyfile");
        } catch (IOException e) {
            log.error("IOException:%", e.getLocalizedMessage());
            throw new BadRequestAlertException("Could not download file", ENTITY_NAME, "couldnotdownload");
        }
        FichierDTO result = fichierService.save(fichierDTO);

        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fichierDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /fichiers/:id} : Partial updates given fields of an existing fichier, field will ignore if it is null
     *
     * @param id         the id of the fichierDTO to save.
     * @param fichierDTO the fichierDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fichierDTO,
     * or with status {@code 400 (Bad Request)} if the fichierDTO is not valid,
     * or with status {@code 404 (Not Found)} if the fichierDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the fichierDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @Secured({ AuthoritiesConstants.IGNORE })
    @PatchMapping(value = "/fichiers/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<FichierDTO> partialUpdateFichier(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody FichierDTO fichierDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Fichier partially : {}, {}", id, fichierDTO);
        if (fichierDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fichierDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fichierRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FichierDTO> result = fichierService.partialUpdate(fichierDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fichierDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /fichiers} : get all the fichiers.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fichiers in body.
     */

    //TODO: TESTER AVEC MAOUIA puisque j'ai un seul fichier

    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.POSTE, AuthoritiesConstants.DISTRIBUTEUR })
    @GetMapping("/fichiers")
    public ResponseEntity<List<FichierDTO>> getAllFichiers(Pageable pageable) {
        String login = SecurityUtils.getCurrentUserLogin().get();
        Optional<User> user = userRepository.findOneByLogin(login);
        //  if(user.isPresent() && user.get().getAuthorities().equals(AuthoritiesConstants.POSTE)){
        Poste poste = posteRepository.findByInternalUser_Login(login);
        if (poste != null && poste.getId() != null) {
            //TODO:fix bug
            Page<FichierDTO> page = fichierRepository
                .findAllByDistributeurId(poste.getDistributeur().getId(), pageable)
                .map(fichierMapper::toDto);
            HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
            return ResponseEntity.ok().headers(headers).body(page.getContent());
        } else {
            Page<FichierDTO> page = fichierService.findAll(pageable);
            HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
            return ResponseEntity.ok().headers(headers).body(page.getContent());
        }
    }

    /**
     * {@code GET  /fichiers/:id} : get the "id" fichier.
     *
     * @param id the id of the fichierDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the fichierDTO, or with status {@code 404 (Not Found)}.
     */
    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.POSTE, AuthoritiesConstants.DISTRIBUTEUR })
    @GetMapping("/fichiers/{id}")
    public ResponseEntity<FichierDTO> getFichier(@PathVariable Long id) {
        log.debug("REST request to get Fichier : {}", id);
        Optional<FichierDTO> fichierDTO = fichierService.findOne(id);
        return ResponseUtil.wrapOrNotFound(fichierDTO);
    }

    /**
     * {@code DELETE  /fichiers/:id} : delete the "id" fichier.
     *
     * @param id the id of the fichierDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER })
    @DeleteMapping("/fichiers/{id}")
    public ResponseEntity<Void> deleteFichier(@PathVariable Long id) {
        log.debug("REST request to delete Fichier : {}", id);
        fichierService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.POSTE })
    @GetMapping("/fichiers/getLigneRestant/{id}")
    public Double getremainingLine(@PathVariable Long id) {
        /*   Double ligneRestant = 0.0;
        Integer nombreFailed50 = 0;
        Integer nombreFailed100 = 0;
        Integer nombreNew50 = 0;
        Integer nombreNew100 = 0;
        Integer total = 0;
        Integer total1 = 0;
        Optional<FichierDTO> fichierdto = fichierService.findOne(id);
        Optional<Lot> lastLot = lotRepository.findTopByFichierIdOrderByOffsetDesc(id);
        List<Document> listes50Failed = documentRepository.findByLot1FichierIdAndPrintStatusAndLot2IsNull(
            id,
            PrintStatus.FAILED,
            Pageable.unpaged()
        );
        List<Document> listes100Failed = documentRepository.findByLot1FichierIdAndPrintStatusAndLot2NotNull(
            id,
            PrintStatus.NEW,
            Pageable.unpaged()
        );
        List<Document> listes50 = documentRepository.findByLot1FichierIdAndPrintStatusAndLot2IsNull(
            id,
            PrintStatus.FAILED,
            Pageable.unpaged()
        );
        List<Document> listes100 = documentRepository.findByLot1FichierIdAndPrintStatusAndLot2NotNull(
            id,
            PrintStatus.NEW,
            Pageable.unpaged()
        );

        if (listes50Failed != null) {
            nombreFailed50 = listes50Failed.size() * 50;
        }
        if (listes100Failed != null) {
            nombreFailed100 = listes100Failed.size() * 100;
        }

        if (listes50 != null) {
            nombreNew50 = listes50.size() * 50;
        }
        if (listes100 != null) {
            nombreNew100 = listes100.size() * 100;
        }
        total = nombreNew50 + nombreNew100;
        total1 = nombreFailed50 + nombreFailed100;

        if (fichierdto.isPresent()) {
            if (lastLot.isPresent()) {
                ligneRestant = fichierdto.get().getCount() - lastLot.get().getOffset() + total - total1;
            } else {
                ligneRestant = fichierdto.get().getCount().doubleValue();
            }
        }*/
        Long remainingNew = documentService.countRemainingNew(id);

        Double remainingInFile = fichierRepository.findById(id).get().getCount() - fichierService.nextOffset(id);
        return remainingNew + remainingInFile;
    }

    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.POSTE })
    @GetMapping("/fichiers/getLigneRestant/{path}/{password}")
    public int getCountRecords(@PathVariable String path, @PathVariable String password) {
        int countRecord = 0;
        try {
            countRecord = fileSourceService.countRecords(path, password);
        } catch (Exception e) {
            System.out.println(e);
        }
        return countRecord;
    }

    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.POSTE })
    @GetMapping("/fichiers/getDocsBySerial/{password}/{serial}")
    public List<DocumentDTO> getDocsBySerial(@RequestParam String file, @PathVariable String password, @PathVariable String serial) {
        int line = fileSourceService.getLineByNumSerial(file, password, serial);
        String livraison = "";
        DocumentDTO documentDTO = new DocumentDTO();
        documentDTO = null;
        String user = SecurityUtils.getCurrentUserLogin().get();
        List<DocumentDTO> listeDoc = documentService.findAllByPrintStatusNotAndPoste(PrintStatus.NEW, user);
        for (DocumentDTO data : listeDoc) {
            int offsetLot1 = data.getLot1().getOffset().intValue();
            boolean decision1 = offsetLot1 <= line && line <= offsetLot1 + 50 ? true : false;

            if (data.getLot2() != null) {
                int offsetLot2 = data.getLot2().getOffset().intValue();
                boolean decision2 = offsetLot2 <= line && line <= offsetLot2 + 50 ? true : false;
                System.out.println(offsetLot1);
                if (decision1) {
                    livraison = data.getLivraison();
                } else if (decision2) {
                    livraison = data.getLivraison();
                }
            } else {
                System.out.println(offsetLot1);
                if (decision1) {
                    livraison = data.getLivraison();
                }
            }
            //if lot2 is null
            //            Double offset=  data.getLot1().getOffset();
            //            Fileid= line==offset? data.getId() : 0L;}
        }
        List<DocumentDTO> documents = new ArrayList<>();
        if (livraison != "") {
            documents = this.documentService.findAllByLivraison(livraison);
            System.out.println("livraison");

            return documents;
        }
        return documents;
    }

    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.POSTE })
    @GetMapping("/fichiers/getDocIdBySerial/{password}/{serial}")
    public DocumentDTO getDocIdBySerial(@RequestParam String file, @PathVariable String password, @PathVariable String serial) {
        System.out.println(file);
        int line = fileSourceService.getLineByNumSerial(file, password, serial);
        Long id = 0L;
        DocumentDTO documentDTO = new DocumentDTO();
        List<DocumentDTO> listeDoc = documentService.findAllByPrintStatusNot(PrintStatus.NEW);
        for (DocumentDTO data : listeDoc) {
            int offsetLot1 = data.getLot1().getOffset().intValue();
            boolean decision1 = offsetLot1 <= line && line <= offsetLot1 + 50 ? true : false;

            if (data.getLot2() != null) {
                int offsetLot2 = data.getLot2().getOffset().intValue();
                boolean decision2 = offsetLot2 <= line && line <= offsetLot2 + 50 ? true : false;
                System.out.println(offsetLot1);
                if (decision1) {
                    documentDTO = data;
                } else if (decision2) {
                    documentDTO = data;
                }
            } else {
                System.out.println(offsetLot1);
                if (decision1) {
                    documentDTO = data;
                }
            }
        }

        return documentDTO;
    }
}
