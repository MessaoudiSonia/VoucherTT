package com.inetum.voucher.service;

import java.security.*;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import org.springframework.stereotype.Service;

@Service
public class RSAService {

    public KeyPair generateKey() throws NoSuchAlgorithmException {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(1024);
        KeyPair pair = generator.generateKeyPair();
        return pair;
    }

    public byte[] encrypt(byte[] code, PublicKey publicKey)
        throws BadPaddingException, IllegalBlockSizeException, NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException {
        Cipher encryptCipher = Cipher.getInstance("RSA");
        encryptCipher.init(Cipher.ENCRYPT_MODE, publicKey);
        byte[] encryptedMessageBytes = encryptCipher.doFinal(code);
        return encryptedMessageBytes;
    }

    public byte[] decrypt(byte[] code, PrivateKey privateKey)
        throws NoSuchPaddingException, NoSuchAlgorithmException, BadPaddingException, IllegalBlockSizeException, InvalidKeyException {
        Cipher decryptCipher = Cipher.getInstance("RSA");
        decryptCipher.init(Cipher.DECRYPT_MODE, privateKey);
        byte[] decryptedMessageBytes = decryptCipher.doFinal(code);
        return decryptedMessageBytes;
    }
    /*   public byte[] bulkEncrypt(byte[] bytes, PublicKey publicKey) {
        for (int i = 0; i < bytes.length; i++) {

        }
    }*/
}
