package com.inetum.voucher.repository;

import com.inetum.voucher.domain.Agent;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Agent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AgentRepository extends JpaRepository<Agent, Long> {}
