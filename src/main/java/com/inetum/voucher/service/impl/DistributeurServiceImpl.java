package com.inetum.voucher.service.impl;

import com.inetum.voucher.domain.Distributeur;
import com.inetum.voucher.domain.User;
import com.inetum.voucher.repository.DistributeurRepository;
import com.inetum.voucher.service.DistributeurService;
import com.inetum.voucher.service.RSAService;
import com.inetum.voucher.service.RandomCredentials;
import com.inetum.voucher.service.UserService;
import com.inetum.voucher.service.dto.AdminUserDTO;
import com.inetum.voucher.service.dto.DistributeurDTO;
import com.inetum.voucher.service.dto.UserDTO;
import com.inetum.voucher.service.mapper.DistributeurMapper;
import com.inetum.voucher.service.mapper.UserMapper;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Distributeur}.
 */
@Service
@Transactional
public class DistributeurServiceImpl implements DistributeurService {

    private final Logger log = LoggerFactory.getLogger(DistributeurServiceImpl.class);

    private final DistributeurRepository distributeurRepository;

    private final DistributeurMapper distributeurMapper;
    private final RandomCredentials randomCredentials;
    private final RSAService rsaService;
    private final UserMapper userMapper;
    private final UserService userService;

    public DistributeurServiceImpl(
        DistributeurRepository distributeurRepository,
        DistributeurMapper distributeurMapper,
        RandomCredentials randomCredentials,
        RSAService rsaService,
        UserMapper userMapper,
        UserService userService
    ) {
        this.distributeurRepository = distributeurRepository;
        this.distributeurMapper = distributeurMapper;
        this.randomCredentials = randomCredentials;
        this.rsaService = rsaService;
        this.userMapper = userMapper;
        this.userService = userService;
    }

    @Override
    public DistributeurDTO save(DistributeurDTO distributeurDTO) {
        log.debug("Request to save Distributeur : {}", distributeurDTO);
        AdminUserDTO userDTO = new AdminUserDTO();
        userDTO.setLogin(randomCredentials.nextLogin());
        userDTO.setFirstName(distributeurDTO.getNom());
        userDTO.setLastName(distributeurDTO.getNom());
        Set<String> authorities = new HashSet<>();
        authorities.add("ROLE_DISTRIBUTEUR");
        userDTO.setAuthorities(authorities);
        String newPassword = randomCredentials.nextPassword();
        User user = userService.registerUser(userDTO, newPassword);
        userService.activateRegistration(user.getActivationKey());
        distributeurDTO.setActivationKey(newPassword);
        UserDTO newUser = userMapper.userToUserDTO(user);
        distributeurDTO.setInternalUser(newUser);
        Distributeur distributeur = distributeurMapper.toEntity(distributeurDTO);
        distributeur = distributeurRepository.save(distributeur);
        return distributeurMapper.toDto(distributeur);
    }

    @Override
    public Optional<DistributeurDTO> partialUpdate(DistributeurDTO distributeurDTO) {
        log.debug("Request to partially update Distributeur : {}", distributeurDTO);

        return distributeurRepository
            .findById(distributeurDTO.getId())
            .map(
                existingDistributeur -> {
                    distributeurMapper.partialUpdate(existingDistributeur, distributeurDTO);
                    return existingDistributeur;
                }
            )
            .map(distributeurRepository::save)
            .map(distributeurMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DistributeurDTO> findAll() {
        log.debug("Request to get all Distributeurs");
        return distributeurRepository.findAll().stream().map(distributeurMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DistributeurDTO> findOne(Long id) {
        log.debug("Request to get Distributeur : {}", id);
        return distributeurRepository.findById(id).map(distributeurMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Distributeur : {}", id);
        distributeurRepository.deleteById(id);
    }
}
