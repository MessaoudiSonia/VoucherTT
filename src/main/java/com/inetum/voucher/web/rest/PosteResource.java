package com.inetum.voucher.web.rest;

import com.inetum.voucher.domain.Poste;
import com.inetum.voucher.repository.PosteRepository;
import com.inetum.voucher.security.AuthoritiesConstants;
import com.inetum.voucher.security.SecurityUtils;
import com.inetum.voucher.service.PosteService;
import com.inetum.voucher.service.UserService;
import com.inetum.voucher.service.dto.PosteDTO;
import com.inetum.voucher.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.NoSuchAlgorithmException;
import java.security.Security;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.annotation.security.PermitAll;
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
 * REST controller for managing {@link com.inetum.voucher.domain.Poste}.
 */
@RestController
@RequestMapping("/api")
public class PosteResource {

    private final Logger log = LoggerFactory.getLogger(PosteResource.class);

    private static final String ENTITY_NAME = "poste";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PosteService posteService;

    private final PosteRepository posteRepository;
    private final UserService userService;

    public PosteResource(PosteService posteService, PosteRepository posteRepository, UserService userService) {
        this.posteService = posteService;
        this.posteRepository = posteRepository;
        this.userService = userService;
    }

    /**
     * {@code POST  /postes} : Create a new poste.
     *
     * @param posteDTO the posteDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new posteDTO, or with status {@code 400 (Bad Request)} if the poste has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER })
    @PostMapping("/postes")
    public ResponseEntity<PosteDTO> createPoste(@Valid @RequestBody PosteDTO posteDTO) throws URISyntaxException, NoSuchAlgorithmException {
        log.debug("REST request to save Poste : {}", posteDTO);
        if (posteDTO.getId() != null) {
            throw new BadRequestAlertException("A new poste cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PosteDTO result = posteService.save(posteDTO);
        return ResponseEntity
            .created(new URI("/api/postes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /postes/:id} : Updates an existing poste.
     *
     * @param id the id of the posteDTO to save.
     * @param posteDTO the posteDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated posteDTO,
     * or with status {@code 400 (Bad Request)} if the posteDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the posteDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/postes/{id}")
    public ResponseEntity<PosteDTO> updatePoste(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody PosteDTO posteDTO
    ) throws URISyntaxException, NoSuchAlgorithmException {
        log.debug("REST request to update Poste : {}, {}", id, posteDTO);
        if (posteDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, posteDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!posteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PosteDTO result = posteService.save(posteDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, posteDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /postes/:id} : Partial updates given fields of an existing poste, field will ignore if it is null
     *
     * @param id the id of the posteDTO to save.
     * @param posteDTO the posteDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated posteDTO,
     * or with status {@code 400 (Bad Request)} if the posteDTO is not valid,
     * or with status {@code 404 (Not Found)} if the posteDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the posteDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @Secured({ AuthoritiesConstants.ADMIN })
    @PatchMapping(value = "/postes/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<PosteDTO> partialUpdatePoste(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody PosteDTO posteDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Poste partially : {}, {}", id, posteDTO);
        if (posteDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, posteDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!posteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PosteDTO> result = posteService.partialUpdate(posteDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, posteDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /postes} : get all the postes.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of postes in body.
     */
    @GetMapping("/postes")
    public ResponseEntity<List<PosteDTO>> getAllPostes(Pageable pageable) {
        log.debug("REST request to get a page of Postes");
        Page<PosteDTO> page = posteService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/postes/ByDistributeur/{nom}")
    public ResponseEntity<List<PosteDTO>> getAllPostesByDistributeur(@PathVariable String nom) {
        List<PosteDTO> postes = posteService.findAllByDistributeur(nom);
        return ResponseEntity.ok().body(postes);
    }

    /**
     * {@code GET  /postes/:id} : get the "id" poste.
     *
     * @param id the id of the posteDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the posteDTO, or with status {@code 404 (Not Found)}.
     */
    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.DISTRIBUTEUR })
    @GetMapping("/postes/{id}")
    public ResponseEntity<PosteDTO> getPoste(@PathVariable Long id) {
        log.debug("REST request to get Poste : {}", id);
        Optional<PosteDTO> posteDTO = posteService.findOne(id);
        return ResponseUtil.wrapOrNotFound(posteDTO);
    }

    @Secured({ AuthoritiesConstants.POSTE, AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER })
    @GetMapping("/postes/privateCle")
    public ResponseEntity<String> getPostePrivateKey() {
        log.debug("REST request to get Poste : {}", SecurityUtils.getCurrentUserLogin());
        String privateKey = posteService.findByLogin(SecurityUtils.getCurrentUserLogin());
        return ResponseEntity.ok().body(privateKey);
    }

    /**
     * {@code DELETE  /postes/:id} : delete the "id" poste.
     *
     * @param id the id of the posteDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @Secured({ AuthoritiesConstants.USER, AuthoritiesConstants.ADMIN })
    @DeleteMapping("/postes/{id}")
    public ResponseEntity<Void> deletePoste(@PathVariable Long id) {
        log.debug("REST request to disable Poste : {}", id);
        //   posteService.delete(id);

        String login;
        Optional<Poste> poste = posteRepository.findById(id);
        login = poste.get().getInternalUser().getLogin();
        userService.setInactive(login);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
