package com.inetum.voucher.domain;

import com.inetum.voucher.domain.enumeration.PrintStatus;
import java.util.List;
import javax.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

public class DocumentSpecification implements Specification<Document> {

    private DocumentCriteria criteria;

    public DocumentSpecification(DocumentCriteria criteria) {
        this.criteria = criteria;
    }

    @Override
    public Predicate toPredicate(Root<Document> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        Predicate predicate = cb.conjunction();
        List<Expression<Boolean>> expressions = predicate.getExpressions();
        if (criteria.getPrinter() != null && !criteria.getPrinter().equals("")) {
            expressions.add(cb.equal(root.get("printer"), criteria.getPrinter()));
        }
        if (criteria.getPrintStatus() != null && !criteria.getPrintStatus().equals("")) {
            expressions.add(cb.equal(root.get("printStatus"), criteria.getPrintStatus()));
        }
        if (criteria.getPoste() != null && !criteria.getPoste().equals("null")) {
            expressions.add(cb.equal(root.get("poste").get("nom"), criteria.getPoste()));
        }
        if (criteria.getDistributeur() != null && !criteria.getDistributeur().equals("")) {
            expressions.add(cb.equal(root.get("poste").get("distributeur").get("nom"), criteria.getDistributeur()));
        }
        return predicate;
    }
}
