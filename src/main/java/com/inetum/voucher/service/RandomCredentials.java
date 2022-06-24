package com.inetum.voucher.service;

import java.security.SecureRandom;
import java.util.Locale;
import java.util.Objects;
import java.util.Random;
import org.springframework.stereotype.Service;

@Service
public class RandomCredentials {

    /**
     * Generate a random login.
     */
    public String nextLogin() {
        for (int idx = 0; idx < loginBuf.length; ++idx) loginBuf[idx] = loginSymbols[random.nextInt(loginSymbols.length)];
        return new String(loginBuf);
    }

    /**
     * Generate a random password.
     */
    public String nextPassword() {
        for (int idx = 0; idx < passBuf.length; ++idx) passBuf[idx] = passSymbols[random.nextInt(passSymbols.length)];
        return new String(passBuf);
    }

    public static final String upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    public static final String lower = upper.toLowerCase(Locale.ROOT);

    public static final String digits = "0123456789";

    public static final String alphanum = upper + lower + digits;

    private final Random random = Objects.requireNonNull(new SecureRandom());

    private final char[] loginSymbols = "abcdefhijkprstuvwx0123456789".toCharArray();
    private final char[] passSymbols = "abcdefhijkprstuvwxACEFGHJKLMNPQRUVWXY0123456789".toCharArray();

    private final char[] loginBuf = new char[7];
    private final char[] passBuf = new char[13];
}
