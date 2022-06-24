package com.inetum.voucher.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.inetum.voucher.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FichierTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Fichier.class);
        Fichier fichier1 = new Fichier();
        fichier1.setId(1L);
        Fichier fichier2 = new Fichier();
        fichier2.setId(fichier1.getId());
        assertThat(fichier1).isEqualTo(fichier2);
        fichier2.setId(2L);
        assertThat(fichier1).isNotEqualTo(fichier2);
        fichier1.setId(null);
        assertThat(fichier1).isNotEqualTo(fichier2);
    }
}
