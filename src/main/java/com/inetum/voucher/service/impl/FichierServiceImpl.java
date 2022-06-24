package com.inetum.voucher.service.impl;

import com.inetum.voucher.domain.Fichier;
import com.inetum.voucher.domain.Lot;
import com.inetum.voucher.repository.DistributeurRepository;
import com.inetum.voucher.repository.FichierRepository;
import com.inetum.voucher.repository.LotRepository;
import com.inetum.voucher.service.FichierService;
import com.inetum.voucher.service.dto.FichierDTO;
import com.inetum.voucher.service.mapper.FichierMapper;
import java.io.File;
import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Fichier}.
 */
@Service
@Transactional
public class FichierServiceImpl implements FichierService {

    private final Logger log = LoggerFactory.getLogger(FichierServiceImpl.class);

    @Value("${ftp.cache}")
    private String fileCache;

    @Value("${ftp.remotepath}")
    private String path;

    private final FichierRepository fichierRepository;
    private final DistributeurRepository distributeurRepository;
    private final FichierMapper fichierMapper;
    private final LotRepository lotRepository;
    private final FileSourceService fileSourceService;

    public FichierServiceImpl(
        FichierRepository fichierRepository,
        DistributeurRepository distributeurRepository,
        FichierMapper fichierMapper,
        LotRepository lotRepository,
        FileSourceService fileSourceService
    ) {
        this.fichierRepository = fichierRepository;
        this.distributeurRepository = distributeurRepository;
        this.fichierMapper = fichierMapper;
        this.lotRepository = lotRepository;
        this.fileSourceService = fileSourceService;
    }

    @Override
    public FichierDTO save(FichierDTO fichierDTO) {
        log.debug("Request to save Fichier : {}", fichierDTO);
        Fichier fichier = fichierMapper.toEntity(fichierDTO);
        fichier = fichierRepository.save(fichier);
        return fichierMapper.toDto(fichier);
    }

    @Override
    public Optional<FichierDTO> partialUpdate(FichierDTO fichierDTO) {
        log.debug("Request to partially update Fichier : {}", fichierDTO);

        return fichierRepository
            .findById(fichierDTO.getId())
            .map(
                existingFichier -> {
                    fichierMapper.partialUpdate(existingFichier, fichierDTO);
                    return existingFichier;
                }
            )
            .map(fichierRepository::save)
            .map(fichierMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FichierDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Fichiers");
        return fichierRepository.findAll(pageable).map(fichierMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<FichierDTO> findOne(Long id) {
        log.debug("Request to get Fichier : {}", id);
        return fichierRepository.findById(id).map(fichierMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Fichier : {}", id);
        fichierRepository.deleteById(id);
    }

    @Override
    public Double nextOffset(Long ficherId) {
        log.debug("Request to get new Offset");
        Optional<Lot> lastLot = lotRepository.findTopByFichierIdOrderByOffsetDesc(ficherId);
        Double nextoffset;
        if (lastLot.isPresent()) {
            nextoffset = lastLot.get().getOffset() + 50;
        } else {
            return 0D;
        }

        return nextoffset;
    }

    @Scheduled(fixedDelay = 10000, initialDelay = 30000)
    public void discoverFiles() {
        log.info("polling FTP for new files:starting");
        log.info("path " + path);
        log.info("path " + fileCache);
        try {
            Collection<String> directories = fileSourceService.listDirectories(path);
            for (String dir : directories) {
                log.info("polling FTP for new files: dicovering directory: " + dir);
                discoverDir(dir);
            }
        } catch (IOException e) {
            log.error("file discovery not working properly IO exception in FTP filesource service: Can not list directories");
        }
        log.info("polling FTP for new files: done");
    }

    private void discoverDir(String dir) {
        File newDir = new File(fileCache + dir);

        Boolean dirCreated = newDir.mkdir();

        if (dirCreated) log.info("new directory % has been created in local cache", newDir.getAbsolutePath());
        distributeurRepository
            .findByCode(dir)
            .ifPresent(
                distributeur -> {
                    log.info("polling FTP for new files:distributeur is present :" + dir + "   ditributeur is:" + distributeur.getNom());
                    try {
                        Collection<String> files = this.fileSourceService.listFiles(path + dir);
                        for (String file : files) {
                            log.info("polling FTP for new files:checking file :" + file);
                            if (!this.fichierRepository.findByPath(dir + "/" + file).isPresent()) {
                                log.info("polling FTP for new files: adding new file  :" + file);
                                Fichier newFichier = new Fichier();
                                newFichier.setPath(dir + "/" + file);
                                newFichier.setDistributeur(distributeur);
                                this.fichierRepository.save(newFichier);
                                log.info("polling FTP for new files:new file saved :" + file);
                            }
                        }
                    } catch (IOException e) {
                        log.error(
                            "file discovery not working properly IO exception in FTP filesource service: Can not list files in : " + dir
                        );
                    }
                }
            );
    }
}
