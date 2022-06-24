package com.inetum.voucher.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.inetum.voucher.IntegrationTest;
import com.inetum.voucher.domain.Document;
import com.inetum.voucher.service.impl.FileSourceService;
import com.inetum.voucher.service.util.EncryptedDoc;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

@IntegrationTest
public class DocumentServiceIT {

    @Autowired
    private DocumentService documentService;

    private static final String FICHIER_ZIP =
        "UEsDBBQDAAAIAMdR6lL3ToGmTAEAAHYSAAALAAAAZmljaGllci5jc3bl0LtNI1AQQNF" +
        "8pe3Ewcy837iALcRaHFhCgICA8qGBUwHZlU52/78+3S8f9/fH7fnydPu8//t6e7" +
        "zfPh+vL3//ZI259ulr/NQl61IRXVH5+6hMwzRNy7RNx9SmK2mEKU1lGqZpWqZtO" +
        "qY2+cYMU5rKNEzTtEzbdExt8o0VpjSVaZimaZm26Zja5Bs7TGkq0zBN0zJt0zG1" +
        "yTdOmNJUpmGapmXapmNqk290mNJUpmGapmXapmNqk29cw5SmMg3TNC3TNh1Tm3g" +
        "jI0xpKtMwTdMybdMxtck3MkxpKtMwTdMybdMxtck3KkxpKtMwTdMybdMxtck3Rp" +
        "jSVKZhmqZl2qZjapNvzDClqUzDNE3LtE3H1CbfWGFKU5mGaZqWaZuOqU2+scOUp" +
        "jIN0zQt0zYdU5t844QpTWUapmlapm06pjb5RocpTWUapmlapp8b31BLAQI/AxQD" +
        "AAAIAMdR6lL3ToGmTAEAAHYSAAALACQAAAAAAAAAIIC0gQAAAABmaWNoaWVyLmN" +
        "zdgoAIAAAAAAAAQAYAAC3n/NrddcBAAAfA2x11wGANtyk2HXXAVBLBQYAAAAAAQABAF0AAAB1AQAAAAA=";

    @Value("${ftp.cache}")
    private String fileCache;

    @BeforeEach
    public void setup() throws IOException {
        File yourFile = new File(fileCache + "fichier.zip");
        yourFile.createNewFile();
        FileOutputStream fileOutputStream = new FileOutputStream(fileCache + "fichier.zip");
        fileOutputStream.write(Base64.getDecoder().decode(FICHIER_ZIP.getBytes()));
        fileOutputStream.close();
    }

    @AfterEach
    public void tearDown() {
        File file = new File(fileCache + "fichier.zip");
        file.delete();
    }

    @Test
    void givenDocument_whenGenerate_thenSizeIsCorrect() throws IOException, IllegalAccessException {
        List<FileSourceService.Record> list = documentService.generate(1L);

        List<FileSourceService.Record> list2 = documentService.generate(2L);
        assertThat(list).hasSize(50);
        assertThat(list2).hasSize(100);
    }

    @Test
    void givenFileIdAndNumber_whenGenerateList_thenSierIsCorrect() {
        List<Document> documents = new ArrayList<>();
        try {
            documents = documentService.provisionNew(10, 1L, true, "poste1", "lkl", "imprimante1");
        } catch (Exception e) {
            e.printStackTrace();
        }
        assertThat(documents).hasSize(10);
    }

    @Test
    void givenFileIdAndNumber_whenGenerateEncryptedDoc_thenSizeIsCorrect() {
        List<EncryptedDoc> documents = new ArrayList<>();
        try {
            documents = documentService.getEncryptedDocuments(1, 1L, true, "poste1", false, "imprimante1");
        } catch (Exception e) {
            e.printStackTrace();
        }
        for (EncryptedDoc encryptedDoc : documents) {
            System.out.println(encryptedDoc.getDocument());
        }
        assertThat(documents).hasSize(1);
    }
}
