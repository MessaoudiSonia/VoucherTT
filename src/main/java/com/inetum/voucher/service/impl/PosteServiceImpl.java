package com.inetum.voucher.service.impl;

import com.inetum.voucher.domain.Poste;
import com.inetum.voucher.domain.User;
import com.inetum.voucher.repository.PosteRepository;
import com.inetum.voucher.service.*;
import com.inetum.voucher.service.dto.AdminUserDTO;
import com.inetum.voucher.service.dto.PosteDTO;
import com.inetum.voucher.service.dto.UserDTO;
import com.inetum.voucher.service.mapper.PosteMapper;
import com.inetum.voucher.service.mapper.UserMapper;
import java.security.KeyPair;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Poste}.
 */
@Service
@Transactional
public class PosteServiceImpl implements PosteService {

    private final Logger log = LoggerFactory.getLogger(PosteServiceImpl.class);

    private final PosteRepository posteRepository;

    private final PosteMapper posteMapper;
    private final RSAService rsaService;
    private final UserMapper userMapper;
    private final UserService userService;
    private final RandomCredentials randomCredentials;

    public PosteServiceImpl(
        PosteRepository posteRepository,
        PosteMapper posteMapper,
        RSAService rsaService,
        UserMapper userMapper,
        UserService userService,
        RandomCredentials randomCredentials
    ) {
        this.posteRepository = posteRepository;
        this.posteMapper = posteMapper;
        this.rsaService = rsaService;
        this.userMapper = userMapper;
        this.userService = userService;
        this.randomCredentials = randomCredentials;
    }

    @Override
    public PosteDTO save(PosteDTO posteDTO) throws NoSuchAlgorithmException {
        log.debug("Request to save Poste : {}", posteDTO);
        AdminUserDTO userDTO = new AdminUserDTO();
        userDTO.setLogin(randomCredentials.nextLogin());
        Set<String> authorities = new HashSet<>();
        authorities.add("ROLE_IGNORE");
        userDTO.setAuthorities(authorities);
        String newPassword = randomCredentials.nextPassword();
        User user = userService.registerUser(userDTO, newPassword);
        userService.activateRegistration(user.getActivationKey());
        UserDTO newUser = userMapper.userToUserDTO(user);
        posteDTO.setActivationKey(newPassword);
        posteDTO.setInternalUser(newUser);
        Poste poste = posteMapper.toEntity(posteDTO);
        KeyPair keyPair = rsaService.generateKey();
        poste.setPrivateKey(Base64.getEncoder().encodeToString(keyPair.getPrivate().getEncoded()));
        poste.setPublicKey(Base64.getEncoder().encodeToString(keyPair.getPublic().getEncoded()));
        poste = posteRepository.save(poste);
        return posteMapper.toDto(poste);
    }

    @Override
    public Optional<PosteDTO> partialUpdate(PosteDTO posteDTO) {
        log.debug("Request to partially update Poste : {}", posteDTO);

        return posteRepository
            .findById(posteDTO.getId())
            .map(
                existingPoste -> {
                    posteMapper.partialUpdate(existingPoste, posteDTO);
                    return existingPoste;
                }
            )
            .map(posteRepository::save)
            .map(posteMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PosteDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Postes");
        return posteRepository.findAll(pageable).map(posteMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PosteDTO> findOne(Long id) {
        log.debug("Request to get Poste : {}", id);
        return posteRepository.findById(id).map(posteMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Poste : {}", id);
        posteRepository.deleteById(id);
    }

    @Override
    public String findByLogin(Optional<String> currentUserLogin) {
        Poste poste = posteRepository.findByInternalUser_Login(currentUserLogin.get());
        return poste.getPrivateKey();
    }

    @Override
    public List<PosteDTO> findAllByDistributeur(String nom) {
        return posteRepository.findAllByDistributeurNom(nom).stream().map(posteMapper::toDto).collect(Collectors.toList());
    }
}
