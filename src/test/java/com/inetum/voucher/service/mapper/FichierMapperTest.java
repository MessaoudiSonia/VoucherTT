package com.inetum.voucher.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class FichierMapperTest {

    private FichierMapper fichierMapper;

    @BeforeEach
    public void setUp() {
        fichierMapper = new FichierMapperImpl();
    }
}
