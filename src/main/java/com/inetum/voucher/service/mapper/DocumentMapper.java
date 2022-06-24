package com.inetum.voucher.service.mapper;

import com.inetum.voucher.domain.*;
import com.inetum.voucher.service.dto.DocumentDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Document} and its DTO {@link DocumentDTO}.
 */
@Mapper(componentModel = "spring", uses = { LotMapper.class, PosteMapper.class, FichierMapper.class })
public interface DocumentMapper extends EntityMapper<DocumentDTO, Document> {
    @Mapping(target = "lot1", source = "lot1", qualifiedByName = "offset")
    @Mapping(target = "lot1.fichier", source = "lot1.fichier", qualifiedByName = "path")
    @Mapping(target = "lot2", source = "lot2", qualifiedByName = "offset")
    @Mapping(target = "lot2.fichier", source = "lot2.fichier", qualifiedByName = "path")
    @Mapping(target = "poste", source = "poste", qualifiedByName = "nom")
    @Mapping(target = "poste.distributeur", source = "poste.distributeur")
    DocumentDTO toDto(Document s);
}
