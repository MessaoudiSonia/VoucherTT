package com.inetum.voucher.repository;

import com.inetum.voucher.domain.Fragment;
import com.inetum.voucher.service.mapper.FragmentMapper;
import java.util.List;
import java.util.Map;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.core.env.Environment;
import org.springframework.data.repository.query.Param;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jdbc.object.SqlQuery;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Configurable
@EnableAutoConfiguration(exclude = { DataSourceAutoConfiguration.class })
public class FragmentJDBCTemplate {

    private final DataSource dataSource;

    private final JdbcTemplate jdbcTemplate;

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Autowired
    public FragmentJDBCTemplate(JdbcTemplate jdbcTemplate, Environment environement, DataSource dataSource) {
        JdbcTemplate jdbcTemplate1;
        String url = "jdbc:h2:mem:vouchertt;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE";
        //  String url ="jdbc:postgresql://localhost:5432/Test?useUnicode=true&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=UTC&relaxAutoCommit=true";
        //            "jdbc:postgresql://vouchertt-postgresqldb:5432/voucherTT?useUnicode=true&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=UTC&relaxAutoCommit=true";
        String username = "voucherTT";
        String password = "";
        //        String username = "postgres";
        //        String password = "root";
        String driverName = "org.postgresql.Driver";
        System.out.println(" url: " + url + "username: " + username + "password :" + password);
        DriverManagerDataSource ds = new DriverManagerDataSource(url, username, password);
        ds.setDriverClassName(driverName);
        jdbcTemplate1 = new JdbcTemplate(ds);
        this.dataSource = ds;
        this.jdbcTemplate = jdbcTemplate1;
    }

    @Transactional
    public List<Fragment> listFragments(@Param("idFichier") int idFichier) {
        String sql =
            "SELECT COUNT(IDD),LIVRAISON, PRINT_STATUS, MIN(INETUM_OFFSET) as START,(MAX(INETUM_OFFSET)+50) as STOP, CREATION,IMPRESSION,PRINTER,POSTE_ID FROM (SELECT DOCUMENT.ID as IDD, LOT.ID as IDL,INETUM_OFFSET, FICHIER_ID,CREATION,IMPRESSION,PRINTER,PRINT_STATUS,POSTE_ID,LIVRAISON FROM LOT INNER JOIN DOCUMENT ON DOCUMENT.LOT1_ID= LOT.ID OR DOCUMENT.LOT2_ID= LOT.ID WHERE FICHIER_ID = " +
            idFichier +
            ") as offsetData GROUP BY LIVRAISON,IDD,PRINT_STATUS,CREATION,IMPRESSION,PRINTER,POSTE_ID,IDD ORDER BY START";
        SqlQuery<Fragment> sqlQuery = new SqlQuery<Fragment>() {
            @Override
            protected RowMapper<Fragment> newRowMapper(Object[] parameters, Map<?, ?> context) {
                return new FragmentMapper();
            }
        };
        sqlQuery.setDataSource(dataSource);
        sqlQuery.setSql(sql);
        List<Fragment> fragments = sqlQuery.execute();
        return fragments;
    }
}
