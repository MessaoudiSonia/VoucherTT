package com.inetum.voucher.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.inetum.voucher.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DistributeurDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(DistributeurDTO.class);
        DistributeurDTO distributeurDTO1 = new DistributeurDTO();
        distributeurDTO1.setId(1L);
        DistributeurDTO distributeurDTO2 = new DistributeurDTO();
        assertThat(distributeurDTO1).isNotEqualTo(distributeurDTO2);
        distributeurDTO2.setId(distributeurDTO1.getId());
        assertThat(distributeurDTO1).isEqualTo(distributeurDTO2);
        distributeurDTO2.setId(2L);
        assertThat(distributeurDTO1).isNotEqualTo(distributeurDTO2);
        distributeurDTO1.setId(null);
        assertThat(distributeurDTO1).isNotEqualTo(distributeurDTO2);
    }
}
