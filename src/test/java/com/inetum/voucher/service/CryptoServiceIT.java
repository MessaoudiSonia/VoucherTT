package com.inetum.voucher.service;

import com.inetum.voucher.IntegrationTest;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

@IntegrationTest
public class CryptoServiceIT {

    @Autowired
    RSAService rsaService;

    @Test
    void givenString_whenEncryptAndDecrypt_thenSuccess()
        throws NoSuchAlgorithmException, IllegalBlockSizeException, InvalidKeyException, NoSuchPaddingException, BadPaddingException, InvalidKeySpecException {
        byte[] input = "1234567890123,12,20082021".getBytes();
        KeyPair key = rsaService.generateKey();

        System.out.println("keys:" + key.getPublic().getEncoded() + "   " + key.getPrivate().getEncoded().length);
        //testing keys conversions to base64 and back
        String pubB64 = Base64.getEncoder().encodeToString(key.getPublic().getEncoded());
        String priB64 = Base64.getEncoder().encodeToString(key.getPrivate().getEncoded());

        System.out.println("pub: " + pubB64);
        System.out.println("pri: " + priB64);
        PublicKey puk = KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(Base64.getDecoder().decode(pubB64)));
        PrivateKey pri = KeyFactory.getInstance("RSA").generatePrivate(new PKCS8EncodedKeySpec(Base64.getDecoder().decode(priB64)));

        System.out.println(input.length);
        byte[] cipherText = rsaService.encrypt(input, puk);
        System.out.println(Base64.getEncoder().encodeToString(cipherText));
        System.out.println(cipherText.length);
        byte[] plainText = rsaService.decrypt(cipherText, pri);
        System.out.println(plainText.length);
        System.out.println(Base64.getEncoder().encodeToString(key.getPrivate().getEncoded()));
        Assertions.assertEquals(new String(input), new String(plainText));
    }
}
