package com.inetum.voucher.service.impl;

import com.inetum.voucher.domain.Agent;
import com.inetum.voucher.domain.User;
import com.inetum.voucher.repository.AgentRepository;
import com.inetum.voucher.service.AgentService;
import com.inetum.voucher.service.RandomCredentials;
import com.inetum.voucher.service.UserService;
import com.inetum.voucher.service.dto.AdminUserDTO;
import com.inetum.voucher.service.dto.AgentDTO;
import com.inetum.voucher.service.dto.UserDTO;
import com.inetum.voucher.service.mapper.AgentMapper;
import com.inetum.voucher.service.mapper.UserMapper;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Agent}.
 */
@Service
@Transactional
public class AgentServiceImpl implements AgentService {

    private final Logger log = LoggerFactory.getLogger(AgentServiceImpl.class);

    private final AgentRepository agentRepository;

    private final AgentMapper agentMapper;

    private final UserService userService;

    private final UserMapper userMapper;

    private final RandomCredentials randomCredentials;

    public AgentServiceImpl(
        AgentRepository agentRepository,
        AgentMapper agentMapper,
        UserService userService,
        UserMapper userMapper,
        RandomCredentials randomCredentials
    ) {
        this.agentRepository = agentRepository;
        this.agentMapper = agentMapper;
        this.userService = userService;
        this.userMapper = userMapper;
        this.randomCredentials = randomCredentials;
    }

    @Override
    public AgentDTO save(AgentDTO agentDTO) {
        AdminUserDTO userDTO = new AdminUserDTO();
        userDTO.setLogin(randomCredentials.nextLogin());
        Set<String> authorities = new HashSet<>();
        //authorities.add("ROLE_USER");
        authorities.add("ROLE_IGNORE");
        userDTO.setAuthorities(authorities);
        String newPassword = randomCredentials.nextPassword();
        User user = userService.registerUser(userDTO, newPassword);
        userService.activateRegistration(user.getActivationKey());
        UserDTO newUser = userMapper.userToUserDTO(user);
        agentDTO.setActivationKey(newPassword);
        agentDTO.setInternalUser(newUser);
        Agent agent = agentMapper.toEntity(agentDTO);
        agent = agentRepository.save(agent);
        return agentMapper.toDto(agent);
        //        log.debug("Request to save Agent : {}", agentDTO);
        //
        //        Agent agent = agentMapper.toEntity(agentDTO);
        //        agent = agentRepository.save(agent);
        //        return agentMapper.toDto(agent);
    }

    @Override
    public Optional<AgentDTO> partialUpdate(AgentDTO agentDTO) {
        log.debug("Request to partially update Agent : {}", agentDTO);

        return agentRepository
            .findById(agentDTO.getId())
            .map(
                existingAgent -> {
                    agentMapper.partialUpdate(existingAgent, agentDTO);
                    return existingAgent;
                }
            )
            .map(agentRepository::save)
            .map(agentMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AgentDTO> findAll() {
        log.debug("Request to get all Agents");
        return agentRepository.findAll().stream().map(agentMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AgentDTO> findOne(Long id) {
        log.debug("Request to get Agent : {}", id);
        return agentRepository.findById(id).map(agentMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Agent : {}", id);
        agentRepository.deleteById(id);
    }
}
