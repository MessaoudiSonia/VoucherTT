package com.inetum.voucher.service.mapper;

import com.inetum.voucher.domain.Historique;
import com.inetum.voucher.service.dto.HistoriqueDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for the entity {@link Historique} and its DTO {@link HistoriqueDTO}.
 */
@Mapper(componentModel = "spring", uses = { DocumentMapper.class })
public interface HistoriqueMapper extends EntityMapper<HistoriqueDTO, Historique> {
    @Mapping(target = "document", source = "document")
    HistoriqueDTO toDto(Historique s);
}
