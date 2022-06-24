package com.inetum.voucher.service.impl;

import com.inetum.voucher.domain.*;
import com.inetum.voucher.domain.enumeration.PrintStatus;
import com.inetum.voucher.repository.HistoriqueRepository;
import com.inetum.voucher.repository.PosteRepository;
import com.inetum.voucher.security.AuthoritiesConstants;
import com.inetum.voucher.service.HistoriqueService;
import com.inetum.voucher.service.UserService;
import com.inetum.voucher.service.dto.HistoriqueDTO;
import com.inetum.voucher.service.mapper.HistoriqueMapper;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Document}.
 */
@Service
@Transactional
public class HistoriqueServiceImpl implements HistoriqueService {

    private final HistoriqueRepository historiqueRepository;
    private final HistoriqueMapper historiqueMapper;
    private final UserService userService;
    private final PosteRepository posteRepository;

    public HistoriqueServiceImpl(
        HistoriqueRepository historiqueRepository,
        HistoriqueMapper historiqueMapper,
        UserService userService,
        PosteRepository posteRepository
    ) {
        this.historiqueRepository = historiqueRepository;
        this.historiqueMapper = historiqueMapper;
        this.userService = userService;
        this.posteRepository = posteRepository;
    }

    @Override
    public HistoriqueDTO save(HistoriqueDTO historiqueDTO) {
        return null;
    }

    @Override
    public Optional<HistoriqueDTO> partialUpdate(HistoriqueDTO historiqueDTO) {
        return Optional.empty();
    }

    @Override
    public List<HistoriqueDTO> findAllHisto() {
        return historiqueMapper.toDto(historiqueRepository.findAll());
    }

    @Override
    public Optional<HistoriqueDTO> findOne(Long id) {
        return Optional.empty();
    }

    @Override
    public void delete(Long id) {}

    @Override
    public List<HistoriqueDTO> findAllByPoste(String userName) {
        Optional<User> user = userService.getUserWithAuthorities();
        Authority posteAuthority = new Authority();
        posteAuthority.setName(AuthoritiesConstants.ADMIN);
        Poste poste = posteRepository.findByInternalUser_Login(userName);
        if (user.isPresent() & user.get().getAuthorities().contains(posteAuthority)) {
            System.out.println("yes");
            return historiqueMapper.toDto(historiqueRepository.findAll());
        } else {
            System.out.println("no");
            return historiqueMapper.toDto(historiqueRepository.findAllByDocumentPosteIdOrderByCreationDesc(poste.getId()));
        }
    }

    @Override
    public List<HistoriqueDTO> findAllByPrintStatusNotAndPoste(PrintStatus printStatus, String userName) {
        Optional<User> user = userService.getUserWithAuthorities();
        Authority posteAuthority = new Authority();
        posteAuthority.setName(AuthoritiesConstants.ADMIN);
        Authority agentAuthority = new Authority();
        posteAuthority.setName(AuthoritiesConstants.USER);
        Poste poste = posteRepository.findByInternalUser_Login(userName);
        if (user.isPresent() & user.get().getAuthorities().contains(posteAuthority)) {
            System.out.println("yes");
            return historiqueMapper.toDto(historiqueRepository.findAllByPrintStatusNot(printStatus));
        } else if (user.isPresent() & user.get().getAuthorities().contains(agentAuthority)) {
            System.out.println("yes");
            return historiqueMapper.toDto(historiqueRepository.findAllByPrintStatusNot(printStatus));
        } else {
            System.out.println("no");
            return historiqueMapper.toDto(historiqueRepository.findAllByPrintStatusNotAndDocumentPosteId(printStatus, poste.getId()));
        }
    }

    @Override
    public Page<HistoriqueDTO> findAllByCriteria(HistoriqueCriteria criteria, Pageable pageable) {
        HistoriqueSpecification spec = new HistoriqueSpecification(criteria);

        return historiqueRepository.findAll(spec, pageable).map(historiqueMapper::toDto);
    }

    public void createHistorique(Document document) {
        Historique historique = new Historique();
        historique.setDocument(document);
        historique.setImpression(document.getImpression());
        historique.setLivraison(document.getLivraison());
        historique.setPrinter(document.getPrinter());
        historique.setCreation(document.getCreation());
        historique.setPrintStatus(document.getPrintStatus());
        historiqueRepository.save(historique);
    }
}
