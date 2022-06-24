package com.inetum.voucher.web.rest;

import com.inetum.voucher.repository.AgentRepository;
import com.inetum.voucher.security.AuthoritiesConstants;
import com.inetum.voucher.service.AgentService;
import com.inetum.voucher.service.dto.AgentDTO;
import com.inetum.voucher.web.rest.errors.BadRequestAlertException;
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
 * REST controller for managing {@link com.inetum.voucher.domain.Agent}.
 */
@RestController
@RequestMapping("/api")
public class AgentResource {

    private final Logger log = LoggerFactory.getLogger(AgentResource.class);

    private static final String ENTITY_NAME = "agent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AgentService agentService;

    private final AgentRepository agentRepository;

    public AgentResource(AgentService agentService, AgentRepository agentRepository) {
        this.agentService = agentService;
        this.agentRepository = agentRepository;
    }

    /**
     * {@code POST  /agents} : Create a new agent.
     *
     * @param agentDTO the agentDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new agentDTO, or with status {@code 400 (Bad Request)} if the agent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @Secured({ AuthoritiesConstants.ADMIN })
    @PostMapping("/agents")
    public ResponseEntity<AgentDTO> createAgent(@Valid @RequestBody AgentDTO agentDTO) throws URISyntaxException {
        log.debug("REST request to save Agent : {}", agentDTO);
        if (agentDTO.getId() != null) {
            throw new BadRequestAlertException("A new agent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AgentDTO result = agentService.save(agentDTO);
        return ResponseEntity
            .created(new URI("/api/agents/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /agents/:id} : Updates an existing agent.
     *
     * @param id the id of the agentDTO to save.
     * @param agentDTO the agentDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated agentDTO,
     * or with status {@code 400 (Bad Request)} if the agentDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the agentDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER })
    @PutMapping("/agents/{id}")
    public ResponseEntity<AgentDTO> updateAgent(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody AgentDTO agentDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Agent : {}, {}", id, agentDTO);
        if (agentDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, agentDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!agentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AgentDTO result = agentService.save(agentDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, agentDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /agents/:id} : Partial updates given fields of an existing agent, field will ignore if it is null
     *
     * @param id the id of the agentDTO to save.
     * @param agentDTO the agentDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated agentDTO,
     * or with status {@code 400 (Bad Request)} if the agentDTO is not valid,
     * or with status {@code 404 (Not Found)} if the agentDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the agentDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER })
    @PatchMapping(value = "/agents/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<AgentDTO> partialUpdateAgent(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody AgentDTO agentDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Agent partially : {}, {}", id, agentDTO);
        if (agentDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, agentDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!agentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AgentDTO> result = agentService.partialUpdate(agentDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, agentDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /agents} : get all the agents.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of agents in body.
     */
    @Secured({ AuthoritiesConstants.ADMIN })
    @GetMapping("/agents")
    public List<AgentDTO> getAllAgents() {
        log.debug("REST request to get all Agents");
        return agentService.findAll();
    }

    /**
     * {@code GET  /agents/:id} : get the "id" agent.
     *
     * @param id the id of the agentDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the agentDTO, or with status {@code 404 (Not Found)}.
     */
    @Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER })
    @GetMapping("/agents/{id}")
    public ResponseEntity<AgentDTO> getAgent(@PathVariable Long id) {
        log.debug("REST request to get Agent : {}", id);
        Optional<AgentDTO> agentDTO = agentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(agentDTO);
    }

    /**
     * {@code DELETE  /agents/:id} : delete the "id" agent.
     *
     * @param id the id of the agentDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @Secured({ AuthoritiesConstants.IGNORE })
    @DeleteMapping("/agents/{id}")
    public ResponseEntity<Void> deleteAgent(@PathVariable Long id) {
        log.debug("REST request to delete Agent : {}", id);
        agentService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
