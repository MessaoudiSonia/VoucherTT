package com.inetum.voucher.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.inetum.voucher.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DistributeurTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Distributeur.class);
        Distributeur distributeur1 = new Distributeur();
        distributeur1.setId(1L);
        Distributeur distributeur2 = new Distributeur();
        distributeur2.setId(distributeur1.getId());
        assertThat(distributeur1).isEqualTo(distributeur2);
        distributeur2.setId(2L);
        assertThat(distributeur1).isNotEqualTo(distributeur2);
        distributeur1.setId(null);
        assertThat(distributeur1).isNotEqualTo(distributeur2);
    }
}
