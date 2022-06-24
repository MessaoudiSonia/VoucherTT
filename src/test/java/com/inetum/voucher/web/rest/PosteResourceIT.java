package com.inetum.voucher.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.inetum.voucher.IntegrationTest;
import com.inetum.voucher.domain.Distributeur;
import com.inetum.voucher.domain.Poste;
import com.inetum.voucher.domain.User;
import com.inetum.voucher.repository.PosteRepository;
import com.inetum.voucher.service.dto.PosteDTO;
import com.inetum.voucher.service.mapper.PosteMapper;
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
 * Integration tests for the {@link PosteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PosteResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_PRIVATE_KEY = "AAAAAAAAAA";
    private static final String UPDATED_PRIVATE_KEY = "BBBBBBBBBB";

    private static final String DEFAULT_PUBLIC_KEY = "AAAAAAAAAA";
    private static final String UPDATED_PUBLIC_KEY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/postes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PosteRepository posteRepository;

    @Autowired
    private PosteMapper posteMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPosteMockMvc;

    private Poste poste;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Poste createEntity(EntityManager em) {
        Poste poste = new Poste().nom(DEFAULT_NOM).code(DEFAULT_CODE).privateKey(DEFAULT_PRIVATE_KEY).publicKey(DEFAULT_PUBLIC_KEY);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        poste.setInternalUser(user);
        // Add required entity
        Distributeur distributeur;
        if (TestUtil.findAll(em, Distributeur.class).isEmpty()) {
            distributeur = DistributeurResourceIT.createEntity(em);
            em.persist(distributeur);
            em.flush();
        } else {
            distributeur = TestUtil.findAll(em, Distributeur.class).get(0);
        }
        poste.setDistributeur(distributeur);
        return poste;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Poste createUpdatedEntity(EntityManager em) {
        Poste poste = new Poste().nom(UPDATED_NOM).code(UPDATED_CODE).privateKey(UPDATED_PRIVATE_KEY).publicKey(UPDATED_PUBLIC_KEY);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        poste.setInternalUser(user);
        // Add required entity
        Distributeur distributeur;
        if (TestUtil.findAll(em, Distributeur.class).isEmpty()) {
            distributeur = DistributeurResourceIT.createUpdatedEntity(em);
            em.persist(distributeur);
            em.flush();
        } else {
            distributeur = TestUtil.findAll(em, Distributeur.class).get(0);
        }
        poste.setDistributeur(distributeur);
        return poste;
    }

    @BeforeEach
    public void initTest() {
        poste = createEntity(em);
    }

    @Test
    @Transactional
    void createPoste() throws Exception {
        int databaseSizeBeforeCreate = posteRepository.findAll().size();
        // Create the Poste
        PosteDTO posteDTO = posteMapper.toDto(poste);
        restPosteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(posteDTO)))
            .andExpect(status().isCreated());

        // Validate the Poste in the database
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeCreate + 1);
        Poste testPoste = posteList.get(posteList.size() - 1);
        assertThat(testPoste.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testPoste.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testPoste.getPrivateKey()).isEqualTo(DEFAULT_PRIVATE_KEY);
        assertThat(testPoste.getPublicKey()).isEqualTo(DEFAULT_PUBLIC_KEY);
    }

    @Test
    @Transactional
    void createPosteWithExistingId() throws Exception {
        // Create the Poste with an existing ID
        poste.setId(1L);
        PosteDTO posteDTO = posteMapper.toDto(poste);

        int databaseSizeBeforeCreate = posteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPosteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(posteDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Poste in the database
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomIsRequired() throws Exception {
        int databaseSizeBeforeTest = posteRepository.findAll().size();
        // set the field null
        poste.setNom(null);

        // Create the Poste, which fails.
        PosteDTO posteDTO = posteMapper.toDto(poste);

        restPosteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(posteDTO)))
            .andExpect(status().isBadRequest());

        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = posteRepository.findAll().size();
        // set the field null
        poste.setCode(null);

        // Create the Poste, which fails.
        PosteDTO posteDTO = posteMapper.toDto(poste);

        restPosteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(posteDTO)))
            .andExpect(status().isBadRequest());

        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPostes() throws Exception {
        // Initialize the database
        posteRepository.saveAndFlush(poste);

        // Get all the posteList
        restPosteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(poste.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].privateKey").value(hasItem(DEFAULT_PRIVATE_KEY)))
            .andExpect(jsonPath("$.[*].publicKey").value(hasItem(DEFAULT_PUBLIC_KEY)));
    }

    @Test
    @Transactional
    void getPoste() throws Exception {
        // Initialize the database
        posteRepository.saveAndFlush(poste);

        // Get the poste
        restPosteMockMvc
            .perform(get(ENTITY_API_URL_ID, poste.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(poste.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.privateKey").value(DEFAULT_PRIVATE_KEY))
            .andExpect(jsonPath("$.publicKey").value(DEFAULT_PUBLIC_KEY));
    }

    @Test
    @Transactional
    void getNonExistingPoste() throws Exception {
        // Get the poste
        restPosteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPoste() throws Exception {
        // Initialize the database
        posteRepository.saveAndFlush(poste);

        int databaseSizeBeforeUpdate = posteRepository.findAll().size();

        // Update the poste
        Poste updatedPoste = posteRepository.findById(poste.getId()).get();
        // Disconnect from session so that the updates on updatedPoste are not directly saved in db
        em.detach(updatedPoste);
        updatedPoste.nom(UPDATED_NOM).code(UPDATED_CODE).privateKey(UPDATED_PRIVATE_KEY).publicKey(UPDATED_PUBLIC_KEY);
        PosteDTO posteDTO = posteMapper.toDto(updatedPoste);

        restPosteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, posteDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(posteDTO))
            )
            .andExpect(status().isOk());

        // Validate the Poste in the database
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeUpdate);
        Poste testPoste = posteList.get(posteList.size() - 1);
        assertThat(testPoste.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testPoste.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testPoste.getPrivateKey()).isEqualTo(UPDATED_PRIVATE_KEY);
        assertThat(testPoste.getPublicKey()).isEqualTo(UPDATED_PUBLIC_KEY);
    }

    @Test
    @Transactional
    void putNonExistingPoste() throws Exception {
        int databaseSizeBeforeUpdate = posteRepository.findAll().size();
        poste.setId(count.incrementAndGet());

        // Create the Poste
        PosteDTO posteDTO = posteMapper.toDto(poste);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPosteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, posteDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(posteDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Poste in the database
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPoste() throws Exception {
        int databaseSizeBeforeUpdate = posteRepository.findAll().size();
        poste.setId(count.incrementAndGet());

        // Create the Poste
        PosteDTO posteDTO = posteMapper.toDto(poste);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPosteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(posteDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Poste in the database
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPoste() throws Exception {
        int databaseSizeBeforeUpdate = posteRepository.findAll().size();
        poste.setId(count.incrementAndGet());

        // Create the Poste
        PosteDTO posteDTO = posteMapper.toDto(poste);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPosteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(posteDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Poste in the database
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePosteWithPatch() throws Exception {
        // Initialize the database
        posteRepository.saveAndFlush(poste);

        int databaseSizeBeforeUpdate = posteRepository.findAll().size();

        // Update the poste using partial update
        Poste partialUpdatedPoste = new Poste();
        partialUpdatedPoste.setId(poste.getId());

        restPosteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPoste.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPoste))
            )
            .andExpect(status().isOk());

        // Validate the Poste in the database
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeUpdate);
        Poste testPoste = posteList.get(posteList.size() - 1);
        assertThat(testPoste.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testPoste.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testPoste.getPrivateKey()).isEqualTo(DEFAULT_PRIVATE_KEY);
        assertThat(testPoste.getPublicKey()).isEqualTo(DEFAULT_PUBLIC_KEY);
    }

    @Test
    @Transactional
    void fullUpdatePosteWithPatch() throws Exception {
        // Initialize the database
        posteRepository.saveAndFlush(poste);

        int databaseSizeBeforeUpdate = posteRepository.findAll().size();

        // Update the poste using partial update
        Poste partialUpdatedPoste = new Poste();
        partialUpdatedPoste.setId(poste.getId());

        partialUpdatedPoste.nom(UPDATED_NOM).code(UPDATED_CODE).privateKey(UPDATED_PRIVATE_KEY).publicKey(UPDATED_PUBLIC_KEY);

        restPosteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPoste.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPoste))
            )
            .andExpect(status().isOk());

        // Validate the Poste in the database
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeUpdate);
        Poste testPoste = posteList.get(posteList.size() - 1);
        assertThat(testPoste.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testPoste.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testPoste.getPrivateKey()).isEqualTo(UPDATED_PRIVATE_KEY);
        assertThat(testPoste.getPublicKey()).isEqualTo(UPDATED_PUBLIC_KEY);
    }

    @Test
    @Transactional
    void patchNonExistingPoste() throws Exception {
        int databaseSizeBeforeUpdate = posteRepository.findAll().size();
        poste.setId(count.incrementAndGet());

        // Create the Poste
        PosteDTO posteDTO = posteMapper.toDto(poste);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPosteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, posteDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(posteDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Poste in the database
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPoste() throws Exception {
        int databaseSizeBeforeUpdate = posteRepository.findAll().size();
        poste.setId(count.incrementAndGet());

        // Create the Poste
        PosteDTO posteDTO = posteMapper.toDto(poste);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPosteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(posteDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Poste in the database
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPoste() throws Exception {
        int databaseSizeBeforeUpdate = posteRepository.findAll().size();
        poste.setId(count.incrementAndGet());

        // Create the Poste
        PosteDTO posteDTO = posteMapper.toDto(poste);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPosteMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(posteDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Poste in the database
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePoste() throws Exception {
        // Initialize the database
        posteRepository.saveAndFlush(poste);

        int databaseSizeBeforeDelete = posteRepository.findAll().size();

        // Delete the poste
        restPosteMockMvc
            .perform(delete(ENTITY_API_URL_ID, poste.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
