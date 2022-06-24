package com.inetum.voucher.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DistributeurMapperTest {

    private DistributeurMapper distributeurMapper;

    @BeforeEach
    public void setUp() {
        distributeurMapper = new DistributeurMapperImpl();
    }
}
