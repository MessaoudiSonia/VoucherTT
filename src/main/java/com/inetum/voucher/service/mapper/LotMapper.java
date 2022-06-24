package com.inetum.voucher.service.mapper;

import com.inetum.voucher.domain.*;
import com.inetum.voucher.service.dto.LotDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Lot} and its DTO {@link LotDTO}.
 */
@Mapper(componentModel = "spring", uses = { FichierMapper.class })
public interface LotMapper extends EntityMapper<LotDTO, Lot> {
    @Mapping(target = "fichier", source = "fichier", qualifiedByName = "path")
    LotDTO toDto(Lot s);

    @Named("offset")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "offset", source = "offset")
    LotDTO toDtoOffset(Lot lot);
}
