package com.inetum.voucher.service.mapper;

import com.inetum.voucher.domain.*;
import com.inetum.voucher.service.dto.DistributeurDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Distributeur} and its DTO {@link DistributeurDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface DistributeurMapper extends EntityMapper<DistributeurDTO, Distributeur> {
    @Named("nom")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nom", source = "nom")
    @Mapping(target = "code", source = "code")
    DistributeurDTO toDtoNom(Distributeur distributeur);
}
