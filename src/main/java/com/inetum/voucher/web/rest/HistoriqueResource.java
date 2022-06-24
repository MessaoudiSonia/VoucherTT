package com.inetum.voucher.web.rest;

import com.inetum.voucher.domain.DocumentCriteria;
import com.inetum.voucher.domain.HistoriqueCriteria;
import com.inetum.voucher.domain.enumeration.PrintStatus;
import com.inetum.voucher.repository.DocumentRepository;
import com.inetum.voucher.repository.PosteRepository;
import com.inetum.voucher.security.AuthoritiesConstants;
import com.inetum.voucher.security.SecurityUtils;
import com.inetum.voucher.service.HistoriqueService;
import com.inetum.voucher.service.PosteService;
import com.inetum.voucher.service.RSAService;
import com.inetum.voucher.service.dto.DocumentDTO;
import com.inetum.voucher.service.dto.HistoriqueDTO;
import com.inetum.voucher.service.impl.HistoriqueServiceImpl;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing {@link com.inetum.voucher.domain.Historique}.
 */
@RestController
@RequestMapping("/api")
public class HistoriqueResource {

    private final Logger log = LoggerFactory.getLogger(HistoriqueResource.class);

    private static final String ENTITY_NAME = "historique";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HistoriqueService historiqueService;

    private final DocumentRepository documentRepository;
    private final RSAService rsaService;
    private final PosteRepository posteRepository;
    private final PosteService posteService;

    public HistoriqueResource(
        HistoriqueServiceImpl historiqueServiceImpl,
        HistoriqueService historiqueService,
        DocumentRepository documentRepository,
        RSAService rsaService,
        PosteRepository posteRepository,
        PosteService posteService
    ) {
        this.historiqueService = historiqueService;
        this.documentRepository = documentRepository;
        this.rsaService = rsaService;
        this.posteRepository = posteRepository;
        this.posteService = posteService;
    }

    @Secured({ AuthoritiesConstants.POSTE, AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER })
    @GetMapping("/historique/all")
    public ResponseEntity<List<HistoriqueDTO>> getAllHistorique() {
        List<HistoriqueDTO> listeHistorique = historiqueService.findAllHisto();

        return ResponseEntity.ok().body(listeHistorique);
    }

    @Secured({ AuthoritiesConstants.POSTE, AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER })
    @GetMapping("/historique/byPoste")
    public ResponseEntity<List<HistoriqueDTO>> getAllHistoriqueByPoste() {
        String user = SecurityUtils.getCurrentUserLogin().get();

        List<HistoriqueDTO> listeHistorique = historiqueService.findAllByPrintStatusNotAndPoste(PrintStatus.SENT, user);

        return ResponseEntity.ok().body(listeHistorique);
    }

    @PostMapping(value = "/historique/query")
    public ResponseEntity<List<HistoriqueDTO>> query(
        @RequestBody HistoriqueCriteria criteria,
        @PageableDefault(size = 10000) Pageable pageable
    ) {
        log.debug("REST request to find by criteria Local : {}", criteria.toString());
        System.out.println(criteria);
        String login = null;
        Page<HistoriqueDTO> page = historiqueService.findAllByCriteria(criteria, pageable);
        System.out.println(page.getContent());
        //HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page);
        return ResponseEntity.ok().body(page.getContent());
    }
}
