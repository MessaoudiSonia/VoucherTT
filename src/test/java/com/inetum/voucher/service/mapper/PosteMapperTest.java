package com.inetum.voucher.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PosteMapperTest {

    private PosteMapper posteMapper;

    @BeforeEach
    public void setUp() {
        posteMapper = new PosteMapperImpl();
    }
}
