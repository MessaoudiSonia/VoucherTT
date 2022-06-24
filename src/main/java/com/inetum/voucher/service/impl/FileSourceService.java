package com.inetum.voucher.service.impl;

import java.io.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import net.lingala.zip4j.ZipFile;
import net.lingala.zip4j.exception.ZipException;
import net.lingala.zip4j.model.FileHeader;
//import org.apache.commons.net.PrintCommandListener;

import net.schmizz.sshj.SSHClient;
import net.schmizz.sshj.sftp.RemoteResourceFilter;
import net.schmizz.sshj.sftp.RemoteResourceInfo;
import net.schmizz.sshj.sftp.SFTPClient;
import net.schmizz.sshj.transport.verification.PromiscuousVerifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.unix4j.Unix4j;
import org.unix4j.builder.Unix4jCommandBuilder;
import org.unix4j.unix.Cut;
import org.unix4j.unix.Grep;
import org.unix4j.unix.grep.GrepOption;
import org.unix4j.unix.grep.GrepOptions;

@Service
public class FileSourceService implements InitializingBean {

    private final Logger log = LoggerFactory.getLogger(FileSourceService.class);
    private static List<String> list = new ArrayList<>();
    SSHClient client = new SSHClient();

    @Value("${ftp.cache}")
    private String fileCache;

    @Value("${ftp.remotepath}")
    private String remotepath;

    @Value("${ftp.server}")
    private String server;

    @Value("${ftp.port}")
    private int port;

    @Value("${ftp.user}")
    private String user;

    @Value("${ftp.password}")
    private String password;

    //private FTPClient ftp;
    private SSHClient sshClient;
    private SFTPClient sftpClient;

    public void setPort(int port) {
        this.port = port;
    }

    private String cachedFile(String file) {
        return fileCache + file;
    }

    public void open() throws IOException {
        /*    ftp = new FTPClient();
        // ftp.pwd();

        ftp.addProtocolCommandListener(new PrintCommandListener(new PrintWriter(System.out)));
        ftp.connect(server, port);
        //     System.out.println("execute pwd" +ftp.doCommandAsStrings("pwd",""));
        //        ftp.makeDirectory("distributeur123");
        // ftp.pwd();
        int reply = ftp.getReplyCode();
        if (!FTPReply.isPositiveCompletion(reply)) {
            ftp.disconnect();
            throw new IOException("Exception in connecting to FTP Server");
        }
        ftp.login(user, password);
    */
        sshClient = setupSshj();
        sftpClient = sshClient.newSFTPClient();
    }

    public void close() throws IOException {
        //ftp.disconnect();
        sftpClient.close();
        sshClient.disconnect();
    }

    public Boolean isFileExist(String path) throws IOException {
        return listFiles(path).contains(path);
    }

    public Collection<String> listFiles(String path) throws IOException {
        this.open();
        List<RemoteResourceInfo> files = sftpClient.ls(path);
        // FTPFile[] files = ftp.listFiles(path);
        this.close();
        return files.stream().map(RemoteResourceInfo::getName).collect(Collectors.toList());
        //   return null;
    }

    public Collection<String> listDirectories(String path) throws IOException {
        log.info("connecting to ssh host % user % password % port % remotePath %", server, user, password, port, remotepath);
        this.open();
        log.info("ssh connection is open");
        List<RemoteResourceInfo> files = sftpClient.ls(
            path,
            new RemoteResourceFilter() {
                @Override
                public boolean accept(RemoteResourceInfo remoteResourceInfo) {
                    return remoteResourceInfo.isDirectory();
                }
            }
        );
        log.info("directory listing done");
        // FTPFile[] files = ftp.listFiles(path);
        this.close();
        return files.stream().map(RemoteResourceInfo::getName).collect(Collectors.toList());
        //   return null;
    }

    public void downloadFile(String source) throws IOException {
        //  FileOutputStream out = new FileOutputStream(cachedFile(source));
        this.open();

        sftpClient.get(remotepath + source, cachedFile(source));
        //ftp.retrieveFile(source, out);
        this.close();
    }

    private Unix4jCommandBuilder readFile(String file, String password) throws IOException, IllegalAccessException {
        File zipfile = new File(cachedFile(file));
        if (!zipfile.exists()) {
            log.info("zip file not cached, downloading file %", remotepath + file);

            try {
                downloadFile(file);
            } catch (IOException e) {
                log.error("Could not download file %", remotepath + file);
                e.printStackTrace();
            }
        }
        ZipFile zipFile = (password == null) ? new ZipFile(cachedFile(file)) : new ZipFile(cachedFile(file), password.toCharArray());
        List<FileHeader> datafiles = new ArrayList<>();
        try {
            datafiles = zipFile.getFileHeaders();
        } catch (ZipException e) {
            log.error("Could not get file headers from %", file);
            e.printStackTrace();
        }
        FileHeader datafile;
        if (datafiles.size() != 1) {
            log.error("File % has more than one file", file);
            throw new IllegalAccessException("too many files in zip");
        } else {
            datafile = datafiles.get(0);
        }
        InputStream dataInputstream = zipFile.getInputStream(datafile);
        return Unix4j.from(dataInputstream);
    }

    public int countRecords(String file, String password) throws IOException, IllegalAccessException {
        return readFile(file, password).toStringList().size();
    }

    public List<String> getRecordStrings(String file, String password, Double offset) throws IOException, IllegalAccessException {
        return readFile(file, password).head(offset.longValue() + 50).tail(50).toStringList();
    }

    public int getLineByNumSerial(String file, String password, String numSerial) {
        // String[] list = new String[1];

        try {
            list =
                readFile(file.trim(), password.trim())
                    .grep(Grep.Options.lineNumber, "," + numSerial.trim() + ",")
                    .cut(Cut.Options.f, ":", 1)
                    .toStringList();

            if (!list.isEmpty()) {
                String str = list.get(0);
                int i = Integer.parseInt(str);
                return i;
            } else {
                System.out.println("notok");
            }
        } catch (IOException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
        return -1;
    }

    public List<Record> getRecords(String file, String password, Double offset) throws IOException, IllegalAccessException {
        List<Record> records = new ArrayList<>();
        for (String s : getRecordStrings(file, password, offset)) {
            String[] cols = s.split(",", 2);
            records.add(new Record(cols[0], cols[1]));
        }
        return records;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        File file = new File(fileCache);

        boolean dirCreated = file.mkdirs();
        if (dirCreated) log.warn("Dossier cache pour fichiers a été crée: " + file.getAbsolutePath()); else log.info(
            "Dossier cache pour fichiers existe: " + file.getAbsolutePath()
        );
    }

    public class Record {

        private String code;
        private String serial;

        public Record(String code, String serial) {
            this.code = code;
            this.serial = serial;
        }

        public String getCode() {
            return code;
        }

        public String getSerial() {
            return serial;
        }
    }

    private SSHClient setupSshj() throws IOException {
        if (client.isConnected()) {
            return client;
        }
        client = new SSHClient();
        client.addHostKeyVerifier(new PromiscuousVerifier());
        client.connect(server, port);
        client.authPassword(user, password);
        return client;
    }
}
