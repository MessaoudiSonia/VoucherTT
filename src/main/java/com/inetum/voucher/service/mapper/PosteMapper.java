package com.inetum.voucher.service.mapper;

import com.inetum.voucher.domain.*;
import com.inetum.voucher.service.dto.PosteDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Poste} and its DTO {@link PosteDTO}.
 */
@Mapper(componentModel = "spring", uses = { UserMapper.class, DistributeurMapper.class })
public interface PosteMapper extends EntityMapper<PosteDTO, Poste> {
    @Mapping(target = "internalUser", source = "internalUser", qualifiedByName = "login")
    @Mapping(target = "distributeur", source = "distributeur", qualifiedByName = "nom")
    @Mapping(target = "publicKey", ignore = true)
    @Mapping(target = "privateKey", ignore = true)
    PosteDTO toDto(Poste s);

    @Named("nom")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nom", source = "nom")
    @Mapping(target = "publicKey", ignore = true)
    @Mapping(target = "privateKey", ignore = true)
    PosteDTO toDtoNom(Poste poste);
}
