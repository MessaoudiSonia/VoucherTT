package com.inetum.voucher.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.inetum.voucher.IntegrationTest;
import com.inetum.voucher.service.impl.FileSourceService;
import java.io.File;
import java.io.IOException;
import java.util.Base64;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockftpserver.fake.FakeFtpServer;
import org.mockftpserver.fake.UserAccount;
import org.mockftpserver.fake.filesystem.*;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

@IntegrationTest
public class FileSourceIT {

    private static final String FICHIER_ZIP =
        "UEsDBBQAAAAIALy9s1KbQDzbMQAAABwKAAALABwAZmljaGllci5jc3ZVVAkAAyOVpWBllaVgdXgL" +
        "AAEE6AMAAAToAwAAS85PSdUpTi3KTMzhMjQyNjE1M7ewNACydGC8UeFR4VHhUeFR4VHhUeFR4VHh" +
        "kSIMAFBLAQIeAxQAAAAIALy9s1KbQDzbMQAAABwKAAALABgAAAAAAAEAAAC0gQAAAABmaWNoaWVy" +
        "LmNzdlVUBQADI5WlYHV4CwABBOgDAAAE6AMAAFBLBQYAAAAAAQABAFEAAAB2AAAAAAA=";

    @Value("${ftp.cache}")
    private String fileCache;

    @Value("${ftp.user}")
    private String user;

    @Value("${ftp.password}")
    private String password;

    private FakeFtpServer fakeFtpServer;

    @Autowired
    private FileSourceService fileSourceService;

    @BeforeEach
    public void setup() throws IOException {
        File zipfile = new File(fileCache + "/fichier.zip");
        if (zipfile.exists()) zipfile.delete();
        MockitoAnnotations.openMocks(this);
        fakeFtpServer = new FakeFtpServer();
        fakeFtpServer.addUserAccount(new UserAccount(user, password, "/"));

        FileSystem fileSystem = new UnixFakeFileSystem();
        DirectoryEntry directoryEntry = new DirectoryEntry("/hello");
        directoryEntry.setGroup("ftp");
        directoryEntry.setLastModified(new Date());
        directoryEntry.setOwner("ftp");

        FileEntry fileEntry = new FileEntry("/hello/fichier.zip");
        fileEntry.setContents(Base64.getDecoder().decode(FICHIER_ZIP));
        fileSystem.add(directoryEntry);
        fileSystem.add(fileEntry);

        fakeFtpServer.setFileSystem(fileSystem);
        fakeFtpServer.setServerControlPort(0);
        fakeFtpServer.start();
        fileSourceService.setPort(fakeFtpServer.getServerControlPort());
    }

    @AfterEach
    public void teardown() throws IOException {
        //   fileSourceService.close();
        fakeFtpServer.stop();
        //   new File(fileCache + "/fichier.zip").delete();
    }

    @Test
    public void givenRemoteAccount_whenListingRemoteFiles_thenItIsContainedInList() throws IOException {
        Collection<String> files = fileSourceService.listFiles("/hello");
        for (String file : files) {
            System.out.println(file);
        }

        assertThat(files).contains("fichier.zip");
    }

    @Test
    public void givenRemoteAccount_whenListingRemoteDirectories_thenItIsContainedInList() throws IOException {
        Collection<String> directories = fileSourceService.listDirectories("");
        for (String file : directories) {
            System.out.println(file);
        }

        assertThat(directories).contains("hello");
    }

    @Test
    public void givenRemoteFile_whenCheckFileExist_thenTrue() throws IOException {
        Boolean exist = fileSourceService.isFileExist("fichier.zip");
        assertThat(exist).isTrue();
    }

    @Test
    public void givenNonExistingRemoteFile_whenCheckFileExist_thenFalse() throws IOException {
        Boolean exist = fileSourceService.isFileExist("notExistingFile");
        assertThat(exist).isFalse();
    }

    @Test
    public void givenRemoteFile_whenDownloadingFile_thenFileExists() throws IOException {
        fileSourceService.downloadFile("/fichier.zip");
        assertThat(new File(fileCache + "/fichier.zip")).exists();
    }

    @Test
    public void givenRemoteFileAndInterval_whenExtractingListOfLines_thenSizeIsCorrect() throws IOException, IllegalAccessException {
        List<FileSourceService.Record> list = fileSourceService.getRecords("fichier.zip", null, 1D);
        assertThat(list).hasSize(50);
    }

    @Test
    public void givenRemoteFile_whenCountingLines_thenSizeIsCorrect() throws IOException, IllegalAccessException {
        // System.out.println(FICHIER_ZIP);
        int count = fileSourceService.countRecords("fichier.zip", null);
        // System.out.println(count);
        assertThat(count).isEqualTo(113);
    }
}
