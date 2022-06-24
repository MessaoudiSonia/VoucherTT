package com.inetum.voucher.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.inetum.voucher.IntegrationTest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

@IntegrationTest
public class PosteServiceIT {

    @Autowired
    private RandomCredentials randomCredentials;

    @Test
    public void givenUsingPlainJava_whenGeneratingRandomStrings_thenSizeIsCorrectAndStringsAreDifferent() {
        String login1 = randomCredentials.nextLogin();
        String login2 = randomCredentials.nextLogin();
        String password1 = randomCredentials.nextPassword();
        String password2 = randomCredentials.nextPassword();
        assertThat(login1).asString().hasSize(7);
        assertThat(password1).asString().hasSize(13);
        Assertions.assertNotEquals(login1, login2);
        Assertions.assertNotEquals(password1, password2);
    }
}
