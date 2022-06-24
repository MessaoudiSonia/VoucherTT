package com.inetum.voucher.web.rest;

import com.inetum.voucher.security.AuthoritiesConstants;
import com.inetum.voucher.service.DocumentService;
import com.inetum.voucher.service.dto.DocumentDTO;
import com.inetum.voucher.service.impl.FileSourceService;
import com.inetum.voucher.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.web.util.HeaderUtil;

@RestController
@RequestMapping("/api")
public class FileSourceRessources {

    private final Logger log = LoggerFactory.getLogger(FileSourceRessources.class);

    private static final String ENTITY_NAME = "fileFtp";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FileSourceService fileSourceService;

    public FileSourceRessources(FileSourceService fileSourceService) {
        this.fileSourceService = fileSourceService;
    }
}
