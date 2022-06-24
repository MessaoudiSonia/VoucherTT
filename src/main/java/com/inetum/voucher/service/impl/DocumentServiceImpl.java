package com.inetum.voucher.service.impl;

import com.inetum.voucher.domain.*;
import com.inetum.voucher.domain.enumeration.PrintStatus;
import com.inetum.voucher.repository.*;
import com.inetum.voucher.security.AuthoritiesConstants;
import com.inetum.voucher.security.SecurityUtils;
import com.inetum.voucher.service.DocumentService;
import com.inetum.voucher.service.RSAService;
import com.inetum.voucher.service.UserService;
import com.inetum.voucher.service.dto.DocumentDTO;
import com.inetum.voucher.service.mapper.DocumentMapper;
import com.inetum.voucher.service.util.EncryptedDoc;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.time.ZonedDateTime;
import java.util.*;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Document}.
 */
@Service
@Transactional
public class DocumentServiceImpl implements DocumentService {

    @Autowired
    private FragmentJDBCTemplate fragmentJDBCTemplate;

    private final Logger log = LoggerFactory.getLogger(DocumentServiceImpl.class);

    private final DocumentRepository documentRepository;

    private final DocumentMapper documentMapper;
    private final FileSourceService fileSourceService;
    private final RSAService rsaService;
    private final UserService userService;
    private final LotServiceImpl lotService;
    private final FichierRepository fichierRepository;
    private final PosteRepository posteRepository;
    private final HistoriqueServiceImpl historiqueServiceImpl;

    public DocumentServiceImpl(
        DocumentRepository documentRepository,
        DocumentMapper documentMapper,
        FileSourceService fileSourceService,
        RSAService rsaService,
        UserService userService,
        LotServiceImpl lotService,
        FichierRepository fichierRepository,
        PosteRepository posteRepository,
        HistoriqueServiceImpl historiqueServiceImpl
    ) {
        this.documentRepository = documentRepository;
        this.documentMapper = documentMapper;
        this.fileSourceService = fileSourceService;
        this.rsaService = rsaService;
        this.userService = userService;
        this.lotService = lotService;
        this.fichierRepository = fichierRepository;
        this.posteRepository = posteRepository;
        this.historiqueServiceImpl = historiqueServiceImpl;
    }

    @Override
    public DocumentDTO save(DocumentDTO documentDTO) {
        log.debug("Request to save Document : {}", documentDTO);
        Document document = documentMapper.toEntity(documentDTO);
        document = documentRepository.save(document);
        return documentMapper.toDto(document);
    }

    @Override
    public Optional<DocumentDTO> partialUpdate(DocumentDTO documentDTO) {
        log.debug("Request to partially update Document : {}", documentDTO);

        return documentRepository
            .findById(documentDTO.getId())
            .map(
                existingDocument -> {
                    documentMapper.partialUpdate(existingDocument, documentDTO);
                    return existingDocument;
                }
            )
            .map(documentRepository::save)
            .map(documentMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DocumentDTO> findAll(Pageable pageable) {
        Optional<User> user = userService.getUserWithAuthorities();
        log.warn(user.isPresent() ? "user is present" : "user not present");
        for (Authority s : user.get().getAuthorities()) {
            log.warn(s.getName());
        }
        Authority posteAuthority = new Authority();
        posteAuthority.setName(AuthoritiesConstants.POSTE);
        if (user.isPresent() & user.get().getAuthorities().contains(posteAuthority)) {
            String login = user.get().getLogin();
            log.debug("Request to get all Documents for poste " + login);
            return documentRepository.findAllByPosteInternalUserLogin(login, pageable).map(documentMapper::toDto);
        } else {
            log.debug("Request to get all Documents");
            return documentRepository.findAll(pageable).map(documentMapper::toDto);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DocumentDTO> findOne(Long id) {
        log.debug("Request to get Document : {}", id);
        return documentRepository.findById(id).map(documentMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Document : {}", id);
        documentRepository.deleteById(id);
    }

    @Override
    public List<FileSourceService.Record> generate(Long id) throws IOException, IllegalAccessException {
        Document document = documentRepository.findById(id).get();
        Lot lot1 = document.getLot1();
        Lot lot2 = document.getLot2();
        List<FileSourceService.Record> recordsList = fileSourceService.getRecords(
            lot1.getFichier().getPath(),
            lot1.getFichier().getPassword(),
            lot1.getOffset()
        );
        if (lot2 != null) recordsList.addAll(
            fileSourceService.getRecords(lot2.getFichier().getPath(), lot2.getFichier().getPassword(), lot1.getOffset())
        );
        return recordsList;
    }

    @Override
    public byte[] recordListToBytes(List<FileSourceService.Record> list) {
        StringBuffer s = new StringBuffer();
        for (FileSourceService.Record r : list) {
            s.append(r.getSerial() + "/" + r.getCode() + "\n");
        }
        return s.toString().getBytes();
    }

    private Document createDocument(Long fichierId, Boolean isDouble, String login, String nomImprimante)
        throws FileNotFoundException, IllegalAccessException {
        log.debug("Request to source a new Documents");
        Poste poste = posteRepository.findByInternalUser_Login(login);
        Optional<Fichier> fichier = fichierRepository.findById(fichierId);
        if (!fichier.isPresent()) {
            throw new FileNotFoundException();
        }
        if (poste.getDistributeur().getId() != fichier.get().getDistributeur().getId()) {
            throw new IllegalAccessException();
        }
        Document document = new Document();
        document.setCreation(ZonedDateTime.now());
        document.setPrinter(nomImprimante);
        document.setPoste(poste);
        document.setPrintStatus(PrintStatus.SENT);
        document.setLot1(lotService.createnew(fichierId));
        if (isDouble) document.setLot2(lotService.createnew(fichierId));
        document = documentRepository.save(document);
        log.debug("new Documents created");
        return document;
    }

    @Override
    public List<Document> provisionNew(
        Integer number,
        Long fichierId,
        Boolean isDouble,
        String login,
        String livraison,
        String nomImprimante
    ) throws IndexOutOfBoundsException {
        List<Document> unusedDocuments = new ArrayList<Document>();
        //            isDouble
        //            ? documentRepository.findByLot1FichierIdAndPrintStatusAndLot2NotNull(fichierId, PrintStatus.NEW, PageRequest.of(0, number))
        //            : documentRepository.findByLot1FichierIdAndPrintStatusAndLot2IsNull(fichierId, PrintStatus.NEW, PageRequest.of(0, number));
        List<Document> documents50 = documentRepository.findByLot1FichierIdAndPrintStatusAndLot2IsNull(
            fichierId,
            PrintStatus.NEW,
            Pageable.unpaged()
        );
        List<Document> documents100 = documentRepository.findByLot1FichierIdAndPrintStatusAndLot2NotNull(
            fichierId,
            PrintStatus.NEW,
            Pageable.unpaged()
        );
        if (isDouble == false && documents50 != null && documents50.size() > 0) {
            unusedDocuments.addAll(documents50);
        }
        if (isDouble == true && documents100 != null && documents100.size() > 0) {
            unusedDocuments.addAll(documents100);
        }
        if (isDouble == false && documents100 != null && documents100.size() > 0) {
            for (int i = 0; i < documents100.size(); i++) {
                if (i + 1 < number) {
                    List<Document> documentsseparated = separateDocument100OftwoDocuments(documents100.get(i));
                    unusedDocuments.addAll(documentsseparated);
                }
            }
        } else if (isDouble && documents50 != null && documents50.size() > 0) {
            int i;
            int taille = documents50.size();
            for (i = 0; i < documents50.size(); i = i + 2) {
                if (i + 1 < documents50.size()) {
                    Document doc = concatTwoDocument50(documents50.get(i), documents50.get(i + 1));
                    unusedDocuments.add(doc);
                }
            }
            System.out.println("indice " + i);
            if (documents50.size() % 2 != 0) {
                Document document = null;
                try {
                    document = createDocument(fichierId, false, login, nomImprimante);
                    Document doc = concatTwoDocument50(documents50.get(taille - 1), document);
                    unusedDocuments.add(doc);
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        }
        int rest = number - unusedDocuments.size();
        List<Document> documents = new ArrayList<>();
        for (int i = 0; i < rest; i++) {
            Document document = null;
            try {
                document = createDocument(fichierId, isDouble, login, nomImprimante);
                documents.add(document);
            } catch (IndexOutOfBoundsException e) {
                documentRepository.deleteAll(documents);
                throw new IndexOutOfBoundsException("Fichier ne contient pas le nombre d'enregistrements demandés il manque " + (rest - i));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        unusedDocuments.addAll(documents);
        setStatusAndPoste(unusedDocuments, PrintStatus.SENT, livraison);
        // documentRepository.deleteAll();
        return unusedDocuments;
    }

    @Override
    public List<Document> provisionFailed(Integer maxNumber, Long fichierId, Boolean isDouble, String livraison)
        throws IndexOutOfBoundsException {
        List<Document> documents = isDouble
            ? documentRepository.findByLot1FichierIdAndPrintStatusAndLot2NotNull(
                fichierId,
                PrintStatus.FAILED,
                PageRequest.of(0, maxNumber)
            )
            : documentRepository.findByLot1FichierIdAndPrintStatusAndLot2IsNull(
                fichierId,
                PrintStatus.FAILED,
                PageRequest.of(0, maxNumber)
            );
        if (documents.size() < maxNumber) {
            throw new IndexOutOfBoundsException(
                "Le Systeme ne possede pas le nombre d'enregistrements recyclables demandés il manque " + (maxNumber - documents.size())
            );
        }
        documents = setStatusAndPoste(documents, PrintStatus.SENT, livraison);
        return documents;
    }

    //@Transactional
    public List<Document> setStatusAndPoste(List<Document> documents, PrintStatus printStatus, String livraison) {
        List<Document> newDocumentList = new ArrayList<>();
        Optional<String> login = SecurityUtils.getCurrentUserLogin();
        Poste poste;
        poste = login.isPresent() ? posteRepository.findByInternalUser_Login(login.get()) : null;
        for (Document document : documents) {
            document.setPrintStatus(printStatus);
            document.setImpression(ZonedDateTime.now());
            if (poste != null) document.setPoste(poste);
            document.setLivraison(livraison);
            document = documentRepository.save(document);
            historiqueServiceImpl.createHistorique(document);
            newDocumentList.add(document);
        }
        return newDocumentList;
    }

    @Override
    public List<EncryptedDoc> getEncryptedDocuments(
        Integer number,
        Long fichierId,
        Boolean isDouble,
        String login,
        Boolean recycle,
        String nomImprimante
    )
        throws NoSuchAlgorithmException, InvalidKeySpecException, IOException, IllegalAccessException, IllegalBlockSizeException, InvalidKeyException, NoSuchPaddingException, BadPaddingException {
        UUID livraison = UUID.randomUUID();

        Poste poste = posteRepository.findByInternalUser_Login(login);
        String publicKeyB64 = poste.getPublicKey();
        PublicKey publicKey;
        if (publicKeyB64.length() > 100) {
            publicKey = KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(Base64.getDecoder().decode(publicKeyB64)));
        } else throw new SecurityException("illegal public key");

        List<Document> documents = (recycle == false)
            ? provisionNew(number, fichierId, isDouble, login, livraison.toString(), nomImprimante)
            : provisionFailed(number, fichierId, isDouble, livraison.toString());

        List<EncryptedDoc> encryptedDocs = new ArrayList<>();
        for (Document document : documents) {
            EncryptedDoc encryptedDoc = new EncryptedDoc();
            encryptedDoc.setId(document.getId());
            encryptedDoc.setLivraison(livraison.toString());
            List<String> records = fileSourceService.getRecordStrings(
                document.getLot1().getFichier().getPath(),
                document.getLot1().getFichier().getPassword(),
                document.getLot1().getOffset()
            );
            if (isDouble) {
                records.addAll(
                    fileSourceService.getRecordStrings(
                        document.getLot2().getFichier().getPath(),
                        document.getLot2().getFichier().getPassword(),
                        document.getLot2().getOffset()
                    )
                );
            }

            List<String> encryptedRecords = new ArrayList<>();
            for (String r : records) {
                encryptedRecords.add(Base64.getEncoder().encodeToString(rsaService.encrypt(r.getBytes(), publicKey)));
            }
            String doc = String.join("\n", encryptedRecords);
            encryptedDoc.setDocument(doc);
            encryptedDocs.add(encryptedDoc);
            //  historiqueServiceImpl.createHistorique(document);
        }
        return encryptedDocs;
    }

    @Override
    public Page<DocumentDTO> findAllByCriteria(DocumentCriteria criteria, Pageable pageable) {
        DocumentSpecification spec = new DocumentSpecification(criteria);

        return documentRepository.findAll(spec, pageable).map(documentMapper::toDto);
    }

    //    @Override
    //    public Page<Document> findByStatus(PrintStatus printStatus, Pageable pageable) {
    //        {
    //            return documentRepository.findByStatus(printStatus,pageable);
    //        }
    //    }

    @Override
    public Page<Document> findByPrintStatus(PrintStatus printStatus, Pageable pageable) {
        {
            return documentRepository.findByPrintStatus(printStatus, pageable);
        }
    }

    @Override
    public List<DocumentDTO> findAllByPosteInternalUserLoginAndPrintStatus(String login, PrintStatus printStatus) {
        Optional<User> user = userService.getUserWithAuthorities();
        printStatus = PrintStatus.FAILED;
        log.warn(user.isPresent() ? "user is present" : "user not present");
        for (Authority s : user.get().getAuthorities()) {
            log.warn(s.getName());
        }
        Authority posteAuthority = new Authority();
        posteAuthority.setName(AuthoritiesConstants.POSTE);
        if (user.isPresent() & user.get().getAuthorities().contains(posteAuthority)) {
            login = user.get().getLogin();
            log.debug("Request to get all Documents for poste" + login);
            return documentMapper.toDto(documentRepository.findAllByPosteInternalUserLoginAndPrintStatus(login, printStatus));
        } else {
            return null;
        }
    }

    @Override
    public void setDocumentSuccess(Long id, String printer) {
        documentRepository
            .findById(id)
            .ifPresent(
                document -> {
                    document.setPrintStatus(PrintStatus.CONSUMED);
                    //    document.setLivraison("");
                    document.setImpression(ZonedDateTime.now());
                    document.setPrinter(printer);
                    this.documentRepository.saveAndFlush(document);
                    historiqueServiceImpl.createHistorique(document);
                }
            );
    }

    @Override
    public void setDocumentFailed(Long id, String printer) {
        documentRepository
            .findById(id)
            .ifPresent(
                document -> {
                    String livraison = document.getLivraison();
                    document.setPrintStatus(PrintStatus.FAILED);
                    // document.setLivraison("");
                    document.setImpression(ZonedDateTime.now());
                    document.setPrinter(printer);
                    this.documentRepository.save(document);
                    historiqueServiceImpl.createHistorique(document);

                    List<Document> documents = this.documentRepository.findByLivraisonAndPrintStatus(livraison, PrintStatus.SENT);
                    setStatusAndPoste(documents, PrintStatus.FAILED, livraison);
                }
            );
    }

    //@Scheduled(fixedDelay = 10000)
    public void unlockSENT() {
        List<Document> documents = documentRepository.findByCreationBeforeAndPrintStatus(
            ZonedDateTime.now().minusMinutes(1),
            PrintStatus.SENT
        );
        setStatusAndPoste(documents, PrintStatus.NEW, "");
    }

    @Override
    public Long countRemainingNew(Long fichierId) {
        return (
            documentRepository.countByPrintStatusAndLot1FichierIdAndLot2NotNull(PrintStatus.NEW, fichierId) *
            100 +
            documentRepository.countByPrintStatusAndLot1FichierIdAndLot2IsNull(PrintStatus.NEW, fichierId) *
            50
        );
    }

    @Override
    public EncryptedDoc getEncryptedDocument(Long id, String login)
        throws NoSuchAlgorithmException, InvalidKeySpecException, IOException, IllegalAccessException, IllegalBlockSizeException, InvalidKeyException, NoSuchPaddingException, BadPaddingException {
        Poste poste = posteRepository.findByInternalUser_Login(login);
        String publicKeyB64 = poste.getPublicKey();
        PublicKey publicKey;
        if (publicKeyB64.length() > 100) {
            publicKey = KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(Base64.getDecoder().decode(publicKeyB64)));
        } else throw new SecurityException("illegal public key");
        Document document = documentRepository.getOne(id);
        EncryptedDoc encryptedDoc = new EncryptedDoc();

        encryptedDoc.setId(document.getId());
        List<String> records = fileSourceService.getRecordStrings(
            document.getLot1().getFichier().getPath(),
            document.getLot1().getFichier().getPassword(),
            document.getLot1().getOffset()
        );
        if (document.getLot2() != null) {
            records.addAll(
                fileSourceService.getRecordStrings(
                    document.getLot2().getFichier().getPath(),
                    document.getLot2().getFichier().getPassword(),
                    document.getLot2().getOffset()
                )
            );
        }

        List<String> encryptedRecords = new ArrayList<>();
        for (String r : records) {
            //            System.out.println("r  "+r);
            //            String[] TEST = r.split(",");
            //            String r1=TEST[0]+","+TEST[1]+","+TEST[2]+","+TEST[4];
            //            System.out.println("r1   "+r1);
            encryptedRecords.add(Base64.getEncoder().encodeToString(rsaService.encrypt(r.getBytes(), publicKey)));
        }
        String doc = String.join("\n", encryptedRecords);
        encryptedDoc.setDocument(doc);
        return encryptedDoc;
    }

    @Override
    public List<DocumentDTO> findAllByPrintStatusNot(PrintStatus printStatus) {
        return documentMapper.toDto(documentRepository.findAllByPrintStatusNot(printStatus));
    }

    @Override
    public List<DocumentDTO> findAllByPrintStatusNotAndPoste(PrintStatus printStatus, String userName) {
        Optional<User> user = userService.getUserWithAuthorities();
        Authority posteAuthority = new Authority();
        posteAuthority.setName(AuthoritiesConstants.ADMIN);

        //  Set<Authority> authorities = user.get().getAuthorities();
        //   AtomicBoolean isAdmin = new AtomicBoolean(false);
        //        authorities.stream().forEach(auth -> {if( auth.getName().contains("ROLE_ADMIN")){
        //            isAdmin.set(true);}});
        //        System.out.println(isAdmin);
        Poste poste = posteRepository.findByInternalUser_Login(userName);
        if (user.isPresent() & user.get().getAuthorities().contains(posteAuthority)) {
            System.out.println("yes");
            return documentMapper.toDto(documentRepository.findAllByPrintStatusNot(printStatus));
        } else {
            System.out.println("no");
            return documentMapper.toDto(documentRepository.findAllByPrintStatusNotAndPosteId(printStatus, poste.getId()));
        }
    }

    @Override
    public List<DocumentDTO> findAllByPrintStatus(PrintStatus printStatus) {
        return documentMapper.toDto(documentRepository.findAllByPrintStatus(printStatus));
    }

    @Override
    public List<DocumentDTO> findByLivraisonAndPrintStatus(String livraison, PrintStatus printStatus) {
        return documentMapper.toDto(documentRepository.findByLivraisonAndPrintStatus(livraison, printStatus));
    }

    @Override
    public List<DocumentDTO> findAllByLivraison(String codeLivraison) {
        return documentMapper.toDto(documentRepository.findAllByLivraison(codeLivraison));
    }

    @Override
    public Document concatTwoDocument50(Document document1, Document document2) {
        document1.setLot2(document2.getLot1());
        documentRepository.save(document1);
        documentRepository.delete(document2);
        return document1;
    }

    @Override
    public List<Document> separateDocument100OftwoDocuments(Document document1) {
        List<Document> documents = new ArrayList<Document>();
        Lot lot2 = document1.getLot2();
        Document doc3 = new Document();
        doc3.setPoste(document1.getPoste());
        doc3.setCreation(document1.getCreation());
        doc3.setPrinter(document1.getPrinter());
        doc3.setPrintStatus(document1.getPrintStatus());
        doc3.setLivraison(document1.getLivraison());
        doc3.setLot1(lot2);
        document1.setLot2(null);
        documentRepository.save(doc3);
        documentRepository.save(document1);
        documents.add(document1);
        documents.add(doc3);
        return documents;
    }

    @Override
    public List<Fragment> groupedByOffset(int idFichier) {
        List<Fragment> fragments = fragmentJDBCTemplate.listFragments(idFichier);
        List<Fragment> outFregments = new ArrayList<>();
        Fragment oldFragment = null;
        int startOffset = 0;
        Integer count = 0;
        for (Fragment fragment : fragments) {
            count++;
            if ((oldFragment != null) && ((oldFragment.getPRINT_STATUS() != fragment.getPRINT_STATUS()))) {
                oldFragment.setSTART(startOffset);
                oldFragment.setSTOP(fragment.START);
                oldFragment.count = count;
                startOffset = fragment.START;
                outFregments.add(oldFragment);
                count = 0;
            }
            oldFragment = fragment;
        }
        oldFragment.setSTART(startOffset);
        oldFragment.count = count++;
        outFregments.add(oldFragment);
        return outFregments;
    }
}
