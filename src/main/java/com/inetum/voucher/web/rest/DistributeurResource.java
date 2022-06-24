package com.inetum.voucher.web.rest;

import com.inetum.voucher.repository.DistributeurRepository;
import com.inetum.voucher.security.AuthoritiesConstants;
import com.inetum.voucher.service.DistributeurService;
import com.inetum.voucher.service.dto.DistributeurDTO;
import com.inetum.voucher.service.impl.FileSourceService;
import com.inetum.voucher.web.rest.errors.BadRequestAlertException;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.inetum.voucher.domain.Distributeur}.
 */
@RestController
@RequestMapping("/api")
public class DistributeurResource {

    private final Logger log = LoggerFactory.getLogger(DistributeurResource.class);

    private static final String ENTITY_NAME = "distributeur";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DistributeurService distributeurService;

    private final FileSourceService fileSourceService;

    private final DistributeurRepository distributeurRepository;

    public DistributeurResource(
        DistributeurService distributeurService,
        DistributeurRepository distributeurRepository,
        FileSourceService fileSourceService
    ) {
        this.distributeurService = distributeurService;
        this.distributeurRepository = distributeurRepository;
        this.fileSourceService = fileSourceService;
    }

    /**
     * {@code POST  /distributeurs} : Create a new distributeur.
     *
     * @param distributeurDTO the distributeurDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new distributeurDTO, or with status {@code 400 (Bad Request)} if the distributeur has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER })
    @PostMapping("/distributeurs")
    public ResponseEntity<DistributeurDTO> createDistributeur(@Valid @RequestBody DistributeurDTO distributeurDTO)
        throws URISyntaxException {
        log.debug("REST request to save Distributeur : {}", distributeurDTO);
        if (distributeurDTO.getId() != null) {
            throw new BadRequestAlertException("A new distributeur cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DistributeurDTO result = distributeurService.save(distributeurDTO);
        return ResponseEntity
            .created(new URI("/api/distributeurs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    //    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER })
    //    @PostMapping("/distributeurs/directory")
    //    public boolean createDistributeurWithDirectory(@Valid @RequestBody DistributeurDTO distributeurDTO)
    //    {
    //        boolean create=false;
    //
    //        DistributeurDTO result = distributeurService.save(distributeurDTO);
    //        try{
    //            create=fileSourceService.CreateDirectory(result.getNom());
    //        }catch (IOException e){
    //            System.out.println(e.getMessage());
    //        }
    //        return create;
    //    }
    /**
     * {@code PUT  /distributeurs/:id} : Updates an existing distributeur.
     *
     * @param id the id of the distributeurDTO to save.
     * @param distributeurDTO the distributeurDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated distributeurDTO,
     * or with status {@code 400 (Bad Request)} if the distributeurDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the distributeurDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER })
    @PutMapping("/distributeurs/{id}")
    public ResponseEntity<DistributeurDTO> updateDistributeur(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody DistributeurDTO distributeurDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Distributeur : {}, {}", id, distributeurDTO);
        if (distributeurDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, distributeurDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!distributeurRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DistributeurDTO result = distributeurService.save(distributeurDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, distributeurDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /distributeurs/:id} : Partial updates given fields of an existing distributeur, field will ignore if it is null
     *
     * @param id the id of the distributeurDTO to save.
     * @param distributeurDTO the distributeurDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated distributeurDTO,
     * or with status {@code 400 (Bad Request)} if the distributeurDTO is not valid,
     * or with status {@code 404 (Not Found)} if the distributeurDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the distributeurDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER })
    @PatchMapping(value = "/distributeurs/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<DistributeurDTO> partialUpdateDistributeur(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DistributeurDTO distributeurDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Distributeur partially : {}, {}", id, distributeurDTO);
        if (distributeurDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, distributeurDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!distributeurRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DistributeurDTO> result = distributeurService.partialUpdate(distributeurDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, distributeurDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /distributeurs} : get all the distributeurs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of distributeurs in body.
     */
    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.DISTRIBUTEUR })
    @GetMapping("/distributeurs")
    public List<DistributeurDTO> getAllDistributeurs() {
        log.debug("REST request to get all Distributeurs");
        return distributeurService.findAll();
    }

    /**
     * {@code GET  /distributeurs/:id} : get the "id" distributeur.
     *
     * @param id the id of the distributeurDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the distributeurDTO, or with status {@code 404 (Not Found)}.
     */
    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.POSTE })
    @GetMapping("/distributeurs/{id}")
    public ResponseEntity<DistributeurDTO> getDistributeur(@PathVariable Long id) {
        log.debug("REST request to get Distributeur : {}", id);
        Optional<DistributeurDTO> distributeurDTO = distributeurService.findOne(id);
        return ResponseUtil.wrapOrNotFound(distributeurDTO);
    }

    /**
     * {@code DELETE  /distributeurs/:id} : delete the "id" distributeur.
     *
     * @param id the id of the distributeurDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER })
    @DeleteMapping("/distributeurs/{id}")
    public ResponseEntity<Void> deleteDistributeur(@PathVariable Long id) {
        log.debug("REST request to delete Distributeur : {}", id);
        distributeurService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
