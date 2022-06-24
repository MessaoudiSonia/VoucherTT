package com.inetum.voucher.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.inetum.voucher.IntegrationTest;
import com.inetum.voucher.domain.Distributeur;
import com.inetum.voucher.domain.Fichier;
import com.inetum.voucher.repository.FichierRepository;
import com.inetum.voucher.service.dto.FichierDTO;
import com.inetum.voucher.service.mapper.FichierMapper;
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
 * Integration tests for the {@link FichierResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FichierResourceIT {

    private static final String DEFAULT_PATH = "AAAAAAAAAA";
    private static final String UPDATED_PATH = "BBBBBBBBBB";

    private static final Long DEFAULT_COUNT = 50L;
    private static final Long UPDATED_COUNT = 51L;

    private static final String DEFAULT_PASSWORD = "AAAAAAAAAA";
    private static final String UPDATED_PASSWORD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/fichiers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FichierRepository fichierRepository;

    @Autowired
    private FichierMapper fichierMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFichierMockMvc;

    private Fichier fichier;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Fichier createEntity(EntityManager em) {
        Fichier fichier = new Fichier().path(DEFAULT_PATH).count(DEFAULT_COUNT).password(DEFAULT_PASSWORD);
        // Add required entity
        Distributeur distributeur;
        if (TestUtil.findAll(em, Distributeur.class).isEmpty()) {
            distributeur = DistributeurResourceIT.createEntity(em);
            em.persist(distributeur);
            em.flush();
        } else {
            distributeur = TestUtil.findAll(em, Distributeur.class).get(0);
        }
        fichier.setDistributeur(distributeur);
        return fichier;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Fichier createUpdatedEntity(EntityManager em) {
        Fichier fichier = new Fichier().path(UPDATED_PATH).count(UPDATED_COUNT).password(UPDATED_PASSWORD);
        // Add required entity
        Distributeur distributeur;
        if (TestUtil.findAll(em, Distributeur.class).isEmpty()) {
            distributeur = DistributeurResourceIT.createUpdatedEntity(em);
            em.persist(distributeur);
            em.flush();
        } else {
            distributeur = TestUtil.findAll(em, Distributeur.class).get(0);
        }
        fichier.setDistributeur(distributeur);
        return fichier;
    }

    @BeforeEach
    public void initTest() {
        fichier = createEntity(em);
    }

    @Test
    @Transactional
    void createFichier() throws Exception {
        int databaseSizeBeforeCreate = fichierRepository.findAll().size();
        // Create the Fichier
        FichierDTO fichierDTO = fichierMapper.toDto(fichier);
        restFichierMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fichierDTO)))
            .andExpect(status().isCreated());

        // Validate the Fichier in the database
        List<Fichier> fichierList = fichierRepository.findAll();
        assertThat(fichierList).hasSize(databaseSizeBeforeCreate + 1);
        Fichier testFichier = fichierList.get(fichierList.size() - 1);
        assertThat(testFichier.getPath()).isEqualTo(DEFAULT_PATH);
        assertThat(testFichier.getCount()).isEqualTo(DEFAULT_COUNT);
        assertThat(testFichier.getPassword()).isEqualTo(DEFAULT_PASSWORD);
    }

    @Test
    @Transactional
    void createFichierWithExistingId() throws Exception {
        // Create the Fichier with an existing ID
        fichier.setId(1L);
        FichierDTO fichierDTO = fichierMapper.toDto(fichier);

        int databaseSizeBeforeCreate = fichierRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFichierMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fichierDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Fichier in the database
        List<Fichier> fichierList = fichierRepository.findAll();
        assertThat(fichierList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPathIsRequired() throws Exception {
        int databaseSizeBeforeTest = fichierRepository.findAll().size();
        // set the field null
        fichier.setPath(null);

        // Create the Fichier, which fails.
        FichierDTO fichierDTO = fichierMapper.toDto(fichier);

        restFichierMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fichierDTO)))
            .andExpect(status().isBadRequest());

        List<Fichier> fichierList = fichierRepository.findAll();
        assertThat(fichierList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCountIsRequired() throws Exception {
        int databaseSizeBeforeTest = fichierRepository.findAll().size();
        // set the field null
        fichier.setCount(null);

        // Create the Fichier, which fails.
        FichierDTO fichierDTO = fichierMapper.toDto(fichier);

        restFichierMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fichierDTO)))
            .andExpect(status().isBadRequest());

        List<Fichier> fichierList = fichierRepository.findAll();
        assertThat(fichierList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPasswordIsRequired() throws Exception {
        int databaseSizeBeforeTest = fichierRepository.findAll().size();
        // set the field null
        fichier.setPassword(null);

        // Create the Fichier, which fails.
        FichierDTO fichierDTO = fichierMapper.toDto(fichier);

        restFichierMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fichierDTO)))
            .andExpect(status().isBadRequest());

        List<Fichier> fichierList = fichierRepository.findAll();
        assertThat(fichierList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFichiers() throws Exception {
        // Initialize the database
        fichierRepository.saveAndFlush(fichier);

        // Get all the fichierList
        restFichierMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(fichier.getId().intValue())))
            .andExpect(jsonPath("$.[*].path").value(hasItem(DEFAULT_PATH)))
            .andExpect(jsonPath("$.[*].count").value(hasItem(DEFAULT_COUNT.intValue())))
            .andExpect(jsonPath("$.[*].password").value(hasItem(DEFAULT_PASSWORD)));
    }

    @Test
    @Transactional
    void getFichier() throws Exception {
        // Initialize the database
        fichierRepository.saveAndFlush(fichier);

        // Get the fichier
        restFichierMockMvc
            .perform(get(ENTITY_API_URL_ID, fichier.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(fichier.getId().intValue()))
            .andExpect(jsonPath("$.path").value(DEFAULT_PATH))
            .andExpect(jsonPath("$.count").value(DEFAULT_COUNT.intValue()))
            .andExpect(jsonPath("$.password").value(DEFAULT_PASSWORD));
    }

    @Test
    @Transactional
    void getNonExistingFichier() throws Exception {
        // Get the fichier
        restFichierMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFichier() throws Exception {
        // Initialize the database
        fichierRepository.saveAndFlush(fichier);

        int databaseSizeBeforeUpdate = fichierRepository.findAll().size();

        // Update the fichier
        Fichier updatedFichier = fichierRepository.findById(fichier.getId()).get();
        // Disconnect from session so that the updates on updatedFichier are not directly saved in db
        em.detach(updatedFichier);
        updatedFichier.path(UPDATED_PATH).count(UPDATED_COUNT).password(UPDATED_PASSWORD);
        FichierDTO fichierDTO = fichierMapper.toDto(updatedFichier);

        restFichierMockMvc
            .perform(
                put(ENTITY_API_URL_ID, fichierDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(fichierDTO))
            )
            .andExpect(status().isOk());

        // Validate the Fichier in the database
        List<Fichier> fichierList = fichierRepository.findAll();
        assertThat(fichierList).hasSize(databaseSizeBeforeUpdate);
        Fichier testFichier = fichierList.get(fichierList.size() - 1);
        assertThat(testFichier.getPath()).isEqualTo(UPDATED_PATH);
        assertThat(testFichier.getCount()).isEqualTo(UPDATED_COUNT);
        assertThat(testFichier.getPassword()).isEqualTo(UPDATED_PASSWORD);
    }

    @Test
    @Transactional
    void putNonExistingFichier() throws Exception {
        int databaseSizeBeforeUpdate = fichierRepository.findAll().size();
        fichier.setId(count.incrementAndGet());

        // Create the Fichier
        FichierDTO fichierDTO = fichierMapper.toDto(fichier);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFichierMockMvc
            .perform(
                put(ENTITY_API_URL_ID, fichierDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(fichierDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fichier in the database
        List<Fichier> fichierList = fichierRepository.findAll();
        assertThat(fichierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFichier() throws Exception {
        int databaseSizeBeforeUpdate = fichierRepository.findAll().size();
        fichier.setId(count.incrementAndGet());

        // Create the Fichier
        FichierDTO fichierDTO = fichierMapper.toDto(fichier);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFichierMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(fichierDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fichier in the database
        List<Fichier> fichierList = fichierRepository.findAll();
        assertThat(fichierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFichier() throws Exception {
        int databaseSizeBeforeUpdate = fichierRepository.findAll().size();
        fichier.setId(count.incrementAndGet());

        // Create the Fichier
        FichierDTO fichierDTO = fichierMapper.toDto(fichier);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFichierMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fichierDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Fichier in the database
        List<Fichier> fichierList = fichierRepository.findAll();
        assertThat(fichierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFichierWithPatch() throws Exception {
        // Initialize the database
        fichierRepository.saveAndFlush(fichier);

        int databaseSizeBeforeUpdate = fichierRepository.findAll().size();

        // Update the fichier using partial update
        Fichier partialUpdatedFichier = new Fichier();
        partialUpdatedFichier.setId(fichier.getId());

        partialUpdatedFichier.path(UPDATED_PATH).count(UPDATED_COUNT).password(UPDATED_PASSWORD);

        restFichierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFichier.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFichier))
            )
            .andExpect(status().isOk());

        // Validate the Fichier in the database
        List<Fichier> fichierList = fichierRepository.findAll();
        assertThat(fichierList).hasSize(databaseSizeBeforeUpdate);
        Fichier testFichier = fichierList.get(fichierList.size() - 1);
        assertThat(testFichier.getPath()).isEqualTo(UPDATED_PATH);
        assertThat(testFichier.getCount()).isEqualTo(UPDATED_COUNT);
        assertThat(testFichier.getPassword()).isEqualTo(UPDATED_PASSWORD);
    }

    @Test
    @Transactional
    void fullUpdateFichierWithPatch() throws Exception {
        // Initialize the database
        fichierRepository.saveAndFlush(fichier);

        int databaseSizeBeforeUpdate = fichierRepository.findAll().size();

        // Update the fichier using partial update
        Fichier partialUpdatedFichier = new Fichier();
        partialUpdatedFichier.setId(fichier.getId());

        partialUpdatedFichier.path(UPDATED_PATH).count(UPDATED_COUNT).password(UPDATED_PASSWORD);

        restFichierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFichier.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFichier))
            )
            .andExpect(status().isOk());

        // Validate the Fichier in the database
        List<Fichier> fichierList = fichierRepository.findAll();
        assertThat(fichierList).hasSize(databaseSizeBeforeUpdate);
        Fichier testFichier = fichierList.get(fichierList.size() - 1);
        assertThat(testFichier.getPath()).isEqualTo(UPDATED_PATH);
        assertThat(testFichier.getCount()).isEqualTo(UPDATED_COUNT);
        assertThat(testFichier.getPassword()).isEqualTo(UPDATED_PASSWORD);
    }

    @Test
    @Transactional
    void patchNonExistingFichier() throws Exception {
        int databaseSizeBeforeUpdate = fichierRepository.findAll().size();
        fichier.setId(count.incrementAndGet());

        // Create the Fichier
        FichierDTO fichierDTO = fichierMapper.toDto(fichier);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFichierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, fichierDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(fichierDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fichier in the database
        List<Fichier> fichierList = fichierRepository.findAll();
        assertThat(fichierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFichier() throws Exception {
        int databaseSizeBeforeUpdate = fichierRepository.findAll().size();
        fichier.setId(count.incrementAndGet());

        // Create the Fichier
        FichierDTO fichierDTO = fichierMapper.toDto(fichier);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFichierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(fichierDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fichier in the database
        List<Fichier> fichierList = fichierRepository.findAll();
        assertThat(fichierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFichier() throws Exception {
        int databaseSizeBeforeUpdate = fichierRepository.findAll().size();
        fichier.setId(count.incrementAndGet());

        // Create the Fichier
        FichierDTO fichierDTO = fichierMapper.toDto(fichier);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFichierMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(fichierDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Fichier in the database
        List<Fichier> fichierList = fichierRepository.findAll();
        assertThat(fichierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFichier() throws Exception {
        // Initialize the database
        fichierRepository.saveAndFlush(fichier);

        int databaseSizeBeforeDelete = fichierRepository.findAll().size();

        // Delete the fichier
        restFichierMockMvc
            .perform(delete(ENTITY_API_URL_ID, fichier.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Fichier> fichierList = fichierRepository.findAll();
        assertThat(fichierList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
