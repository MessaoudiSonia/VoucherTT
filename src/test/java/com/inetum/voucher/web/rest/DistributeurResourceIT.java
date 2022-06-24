package com.inetum.voucher.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.inetum.voucher.IntegrationTest;
import com.inetum.voucher.domain.Distributeur;
import com.inetum.voucher.repository.DistributeurRepository;
import com.inetum.voucher.service.dto.DistributeurDTO;
import com.inetum.voucher.service.mapper.DistributeurMapper;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link DistributeurResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DistributeurResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/distributeurs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DistributeurRepository distributeurRepository;

    @Autowired
    private DistributeurMapper distributeurMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDistributeurMockMvc;

    private Distributeur distributeur;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Distributeur createEntity(EntityManager em) {
        Distributeur distributeur = new Distributeur().nom(DEFAULT_NOM).code(DEFAULT_CODE);
        return distributeur;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Distributeur createUpdatedEntity(EntityManager em) {
        Distributeur distributeur = new Distributeur().nom(UPDATED_NOM).code(UPDATED_CODE);
        return distributeur;
    }

    @BeforeEach
    public void initTest() {
        distributeur = createEntity(em);
    }

    @Test
    @Transactional
    void createDistributeur() throws Exception {
        int databaseSizeBeforeCreate = distributeurRepository.findAll().size();
        // Create the Distributeur
        DistributeurDTO distributeurDTO = distributeurMapper.toDto(distributeur);
        restDistributeurMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(distributeurDTO))
            )
            .andExpect(status().isCreated());

        // Validate the Distributeur in the database
        List<Distributeur> distributeurList = distributeurRepository.findAll();
        assertThat(distributeurList).hasSize(databaseSizeBeforeCreate + 1);
        Distributeur testDistributeur = distributeurList.get(distributeurList.size() - 1);
        assertThat(testDistributeur.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testDistributeur.getCode()).isEqualTo(DEFAULT_CODE);
    }

    @Test
    @Transactional
    void createDistributeurWithExistingId() throws Exception {
        // Create the Distributeur with an existing ID
        distributeur.setId(1L);
        DistributeurDTO distributeurDTO = distributeurMapper.toDto(distributeur);

        int databaseSizeBeforeCreate = distributeurRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDistributeurMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(distributeurDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Distributeur in the database
        List<Distributeur> distributeurList = distributeurRepository.findAll();
        assertThat(distributeurList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomIsRequired() throws Exception {
        int databaseSizeBeforeTest = distributeurRepository.findAll().size();
        // set the field null
        distributeur.setNom(null);

        // Create the Distributeur, which fails.
        DistributeurDTO distributeurDTO = distributeurMapper.toDto(distributeur);

        restDistributeurMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(distributeurDTO))
            )
            .andExpect(status().isBadRequest());

        List<Distributeur> distributeurList = distributeurRepository.findAll();
        assertThat(distributeurList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = distributeurRepository.findAll().size();
        // set the field null
        distributeur.setCode(null);

        // Create the Distributeur, which fails.
        DistributeurDTO distributeurDTO = distributeurMapper.toDto(distributeur);

        restDistributeurMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(distributeurDTO))
            )
            .andExpect(status().isBadRequest());

        List<Distributeur> distributeurList = distributeurRepository.findAll();
        assertThat(distributeurList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDistributeurs() throws Exception {
        // Initialize the database
        distributeurRepository.saveAndFlush(distributeur);

        // Get all the distributeurList
        restDistributeurMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(distributeur.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)));
    }

    @Test
    @Transactional
    void getDistributeur() throws Exception {
        // Initialize the database
        distributeurRepository.saveAndFlush(distributeur);

        // Get the distributeur
        restDistributeurMockMvc
            .perform(get(ENTITY_API_URL_ID, distributeur.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(distributeur.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE));
    }

    @Test
    @Transactional
    void getNonExistingDistributeur() throws Exception {
        // Get the distributeur
        restDistributeurMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDistributeur() throws Exception {
        // Initialize the database
        distributeurRepository.saveAndFlush(distributeur);

        int databaseSizeBeforeUpdate = distributeurRepository.findAll().size();

        // Update the distributeur
        Distributeur updatedDistributeur = distributeurRepository.findById(distributeur.getId()).get();
        // Disconnect from session so that the updates on updatedDistributeur are not directly saved in db
        em.detach(updatedDistributeur);
        updatedDistributeur.nom(UPDATED_NOM).code(UPDATED_CODE);
        DistributeurDTO distributeurDTO = distributeurMapper.toDto(updatedDistributeur);

        restDistributeurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, distributeurDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(distributeurDTO))
            )
            .andExpect(status().isOk());

        // Validate the Distributeur in the database
        List<Distributeur> distributeurList = distributeurRepository.findAll();
        assertThat(distributeurList).hasSize(databaseSizeBeforeUpdate);
        Distributeur testDistributeur = distributeurList.get(distributeurList.size() - 1);
        assertThat(testDistributeur.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testDistributeur.getCode()).isEqualTo(UPDATED_CODE);
    }

    @Test
    @Transactional
    void putNonExistingDistributeur() throws Exception {
        int databaseSizeBeforeUpdate = distributeurRepository.findAll().size();
        distributeur.setId(count.incrementAndGet());

        // Create the Distributeur
        DistributeurDTO distributeurDTO = distributeurMapper.toDto(distributeur);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDistributeurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, distributeurDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(distributeurDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Distributeur in the database
        List<Distributeur> distributeurList = distributeurRepository.findAll();
        assertThat(distributeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDistributeur() throws Exception {
        int databaseSizeBeforeUpdate = distributeurRepository.findAll().size();
        distributeur.setId(count.incrementAndGet());

        // Create the Distributeur
        DistributeurDTO distributeurDTO = distributeurMapper.toDto(distributeur);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDistributeurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(distributeurDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Distributeur in the database
        List<Distributeur> distributeurList = distributeurRepository.findAll();
        assertThat(distributeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDistributeur() throws Exception {
        int databaseSizeBeforeUpdate = distributeurRepository.findAll().size();
        distributeur.setId(count.incrementAndGet());

        // Create the Distributeur
        DistributeurDTO distributeurDTO = distributeurMapper.toDto(distributeur);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDistributeurMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(distributeurDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Distributeur in the database
        List<Distributeur> distributeurList = distributeurRepository.findAll();
        assertThat(distributeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDistributeurWithPatch() throws Exception {
        // Initialize the database
        distributeurRepository.saveAndFlush(distributeur);

        int databaseSizeBeforeUpdate = distributeurRepository.findAll().size();

        // Update the distributeur using partial update
        Distributeur partialUpdatedDistributeur = new Distributeur();
        partialUpdatedDistributeur.setId(distributeur.getId());

        partialUpdatedDistributeur.nom(UPDATED_NOM).code(UPDATED_CODE);

        restDistributeurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDistributeur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDistributeur))
            )
            .andExpect(status().isOk());

        // Validate the Distributeur in the database
        List<Distributeur> distributeurList = distributeurRepository.findAll();
        assertThat(distributeurList).hasSize(databaseSizeBeforeUpdate);
        Distributeur testDistributeur = distributeurList.get(distributeurList.size() - 1);
        assertThat(testDistributeur.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testDistributeur.getCode()).isEqualTo(UPDATED_CODE);
    }

    @Test
    @Transactional
    void fullUpdateDistributeurWithPatch() throws Exception {
        // Initialize the database
        distributeurRepository.saveAndFlush(distributeur);

        int databaseSizeBeforeUpdate = distributeurRepository.findAll().size();

        // Update the distributeur using partial update
        Distributeur partialUpdatedDistributeur = new Distributeur();
        partialUpdatedDistributeur.setId(distributeur.getId());

        partialUpdatedDistributeur.nom(UPDATED_NOM).code(UPDATED_CODE);

        restDistributeurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDistributeur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDistributeur))
            )
            .andExpect(status().isOk());

        // Validate the Distributeur in the database
        List<Distributeur> distributeurList = distributeurRepository.findAll();
        assertThat(distributeurList).hasSize(databaseSizeBeforeUpdate);
        Distributeur testDistributeur = distributeurList.get(distributeurList.size() - 1);
        assertThat(testDistributeur.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testDistributeur.getCode()).isEqualTo(UPDATED_CODE);
    }

    @Test
    @Transactional
    void patchNonExistingDistributeur() throws Exception {
        int databaseSizeBeforeUpdate = distributeurRepository.findAll().size();
        distributeur.setId(count.incrementAndGet());

        // Create the Distributeur
        DistributeurDTO distributeurDTO = distributeurMapper.toDto(distributeur);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDistributeurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, distributeurDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(distributeurDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Distributeur in the database
        List<Distributeur> distributeurList = distributeurRepository.findAll();
        assertThat(distributeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDistributeur() throws Exception {
        int databaseSizeBeforeUpdate = distributeurRepository.findAll().size();
        distributeur.setId(count.incrementAndGet());

        // Create the Distributeur
        DistributeurDTO distributeurDTO = distributeurMapper.toDto(distributeur);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDistributeurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(distributeurDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Distributeur in the database
        List<Distributeur> distributeurList = distributeurRepository.findAll();
        assertThat(distributeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDistributeur() throws Exception {
        int databaseSizeBeforeUpdate = distributeurRepository.findAll().size();
        distributeur.setId(count.incrementAndGet());

        // Create the Distributeur
        DistributeurDTO distributeurDTO = distributeurMapper.toDto(distributeur);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDistributeurMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(distributeurDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Distributeur in the database
        List<Distributeur> distributeurList = distributeurRepository.findAll();
        assertThat(distributeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDistributeur() throws Exception {
        // Initialize the database
        distributeurRepository.saveAndFlush(distributeur);

        int databaseSizeBeforeDelete = distributeurRepository.findAll().size();

        // Delete the distributeur
        restDistributeurMockMvc
            .perform(delete(ENTITY_API_URL_ID, distributeur.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Distributeur> distributeurList = distributeurRepository.findAll();
        assertThat(distributeurList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
