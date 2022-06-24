package com.inetum.voucher.service.impl;

import com.inetum.voucher.domain.Fichier;
import com.inetum.voucher.domain.Lot;
import com.inetum.voucher.repository.FichierRepository;
import com.inetum.voucher.repository.LotRepository;
import com.inetum.voucher.service.FichierService;
import com.inetum.voucher.service.LotService;
import com.inetum.voucher.service.dto.LotDTO;
import com.inetum.voucher.service.mapper.LotMapper;
import java.io.FileNotFoundException;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Lot}.
 */
@Service
@Transactional
public class LotServiceImpl implements LotService {

    private final Logger log = LoggerFactory.getLogger(LotServiceImpl.class);

    private final LotRepository lotRepository;

    private final LotMapper lotMapper;
    private final FichierRepository fichierRepository;
    private final FichierService fichierService;

    public LotServiceImpl(
        LotRepository lotRepository,
        LotMapper lotMapper,
        FichierRepository fichierRepository,
        FichierService fichierService
    ) {
        this.lotRepository = lotRepository;
        this.lotMapper = lotMapper;
        this.fichierRepository = fichierRepository;
        this.fichierService = fichierService;
    }

    @Override
    public LotDTO save(LotDTO lotDTO) {
        log.debug("Request to save Lot : {}", lotDTO);
        Lot lot = lotMapper.toEntity(lotDTO);
        lot = lotRepository.save(lot);
        return lotMapper.toDto(lot);
    }

    @Override
    public Optional<LotDTO> partialUpdate(LotDTO lotDTO) {
        log.debug("Request to partially update Lot : {}", lotDTO);

        return lotRepository
            .findById(lotDTO.getId())
            .map(
                existingLot -> {
                    lotMapper.partialUpdate(existingLot, lotDTO);
                    return existingLot;
                }
            )
            .map(lotRepository::save)
            .map(lotMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LotDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Lots");
        return lotRepository.findAll(pageable).map(lotMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<LotDTO> findOne(Long id) {
        log.debug("Request to get Lot : {}", id);
        return lotRepository.findById(id).map(lotMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Lot : {}", id);
        lotRepository.deleteById(id);
    }

    @Override
    public Lot createnew(Long fichierId) throws FileNotFoundException {
        log.debug("Request to source a new Lot");
        Lot lot = new Lot();
        Optional<Fichier> fichier = fichierRepository.findById(fichierId);
        Double nextoffset = fichierService.nextOffset(fichierId);
        if (fichier.isPresent()) {
            if (fichier.get().getCount() < nextoffset + 50) {
                throw new FileNotFoundException();
            }
            lot.setFichier(fichier.get());
        }

        lot.setOffset(nextoffset);
        lot = lotRepository.save(lot);
        log.debug("new Lot created");
        return lot;
    }
}
