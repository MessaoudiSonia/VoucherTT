package com.inetum.voucher.domain;

import java.util.List;
import javax.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

public class HistoriqueSpecification implements Specification<Historique> {

    private HistoriqueCriteria criteria;

    public HistoriqueSpecification(HistoriqueCriteria criteria) {
        this.criteria = criteria;
    }

    @Override
    public Predicate toPredicate(Root<Historique> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        Predicate predicate = cb.conjunction();
        List<Expression<Boolean>> expressions = predicate.getExpressions();
        if (criteria.getPrinter() != null && !criteria.getPrinter().equals("")) {
            expressions.add(cb.equal(root.get("printer"), criteria.getPrinter()));
        }
        if (criteria.getPrintStatus() != null && !criteria.getPrintStatus().equals("")) {
            expressions.add(cb.equal(root.get("printStatus"), criteria.getPrintStatus()));
        }
        if (criteria.getPosteId() != null && !criteria.getPosteId().equals("null")) {
            System.out.println("criteria.getPosteId()" + criteria.getPosteId());
            expressions.add(cb.equal(root.join("document").get("poste").get("id"), criteria.getPosteId()));
        }
        if (criteria.getDistributeur() != null && !criteria.getDistributeur().equals("")) {
            expressions.add(cb.equal(root.join("document").get("poste").get("distributeur").get("nom"), criteria.getDistributeur()));
        }
        return predicate;
    }
}
