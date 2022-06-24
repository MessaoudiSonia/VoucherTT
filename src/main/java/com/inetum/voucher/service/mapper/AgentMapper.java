package com.inetum.voucher.service.mapper;

import com.inetum.voucher.domain.*;
import com.inetum.voucher.service.dto.AgentDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Agent} and its DTO {@link AgentDTO}.
 */
@Mapper(componentModel = "spring", uses = { UserMapper.class })
public interface AgentMapper extends EntityMapper<AgentDTO, Agent> {
    @Mapping(target = "internalUser", source = "internalUser", qualifiedByName = "login")
    AgentDTO toDto(Agent s);
}
