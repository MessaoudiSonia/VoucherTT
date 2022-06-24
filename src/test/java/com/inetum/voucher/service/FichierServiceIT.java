package com.inetum.voucher.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.inetum.voucher.IntegrationTest;
import java.io.IOException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

@IntegrationTest
public class FichierServiceIT {

    @Autowired
    private FichierService fichierService;

    @BeforeEach
    public void setup() throws IOException {}

    //    @AfterEach
    public void tearDown() {}

    @Test
    void givenFile_whenAskForNextOffset_thenIsInFileInterval() throws IOException {
        Long id = 1L;
        Double next = fichierService.nextOffset(id);
        Long size = fichierService.findOne(id).get().getCount();
        assertThat(size).isGreaterThan(next.longValue() + 50);
    }
}
