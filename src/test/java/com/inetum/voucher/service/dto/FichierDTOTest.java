package com.inetum.voucher.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.inetum.voucher.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FichierDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(FichierDTO.class);
        FichierDTO fichierDTO1 = new FichierDTO();
        fichierDTO1.setId(1L);
        FichierDTO fichierDTO2 = new FichierDTO();
        assertThat(fichierDTO1).isNotEqualTo(fichierDTO2);
        fichierDTO2.setId(fichierDTO1.getId());
        assertThat(fichierDTO1).isEqualTo(fichierDTO2);
        fichierDTO2.setId(2L);
        assertThat(fichierDTO1).isNotEqualTo(fichierDTO2);
        fichierDTO1.setId(null);
        assertThat(fichierDTO1).isNotEqualTo(fichierDTO2);
    }
}
