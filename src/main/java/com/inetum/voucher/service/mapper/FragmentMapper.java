package com.inetum.voucher.service.mapper;

import com.inetum.voucher.domain.Fragment;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.jdbc.core.RowMapper;

public class FragmentMapper implements RowMapper<Fragment> {

    public Fragment mapRow(ResultSet rs, int rowNum) throws SQLException {
        Fragment fragment = new Fragment();
        //        fragment.setN_LOT(rs.getString("N_LOT"));
        fragment.setPRINT_STATUS(rs.getString("PRINT_STATUS"));
        fragment.setPOSTE_ID(rs.getString("POSTE_ID"));
        fragment.setPRINTER(rs.getString("PRINTER"));
        fragment.setSTART(rs.getInt("START"));
        fragment.setSTOP(rs.getInt("STOP"));
        return fragment;
    }
}
