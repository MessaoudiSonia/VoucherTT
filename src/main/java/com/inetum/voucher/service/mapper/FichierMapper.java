package com.inetum.voucher.service.mapper;

import com.inetum.voucher.domain.*;
import com.inetum.voucher.service.dto.FichierDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Fichier} and its DTO {@link FichierDTO}.
 */
@Mapper(componentModel = "spring", uses = { DistributeurMapper.class })
public interface FichierMapper extends EntityMapper<FichierDTO, Fichier> {
    @Mapping(target = "distributeur", source = "distributeur", qualifiedByName = "nom")
    FichierDTO toDto(Fichier s);

    @Named("path")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "path", source = "path")
    @Mapping(target = "distributeur", source = "distributeur")
    FichierDTO toDtoPath(Fichier fichier);
}
