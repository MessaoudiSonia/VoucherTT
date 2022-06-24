package com.inetum.voucher.service;

import com.inetum.voucher.IntegrationTest;
import com.inetum.voucher.domain.Fragment;
import com.inetum.voucher.repository.FragmentJDBCTemplate;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

@IntegrationTest
public class FragmentServiceIT {

    @Autowired
    private FragmentJDBCTemplate fragmentJDBCTemplate;

    @Test
    public void givenFile_whenGetFragments_thenListIsCorrect() {
        List<Fragment> fragments = fragmentJDBCTemplate.listFragments(1);
        System.out.println("-------- Not Filtred ---------");
        List<Fragment> outFregments = new ArrayList<>();
        Fragment oldFragment = null;
        int startOffset = 0;
        Integer count = 0;
        for (Fragment fragment : fragments) {
            count++;
            System.out.println(fragment.PRINT_STATUS + "|" + fragment.START + "|" + fragment.STOP);
            if ((oldFragment != null) && ((oldFragment.getPRINT_STATUS() != fragment.getPRINT_STATUS()))) {
                oldFragment.setSTART(startOffset);
                oldFragment.setSTOP(fragment.START);
                oldFragment.count = count;
                startOffset = fragment.START;
                outFregments.add(oldFragment);
                count = 0;
            }
            oldFragment = fragment;
        }
        oldFragment.setSTART(startOffset);
        oldFragment.count = count++;
        outFregments.add(oldFragment);

        System.out.println("------ Filtred ---------");
        for (Fragment fragment : outFregments) {
            System.out.println(fragment.PRINT_STATUS + "|" + fragment.START + "|" + fragment.STOP + "|" + fragment.count);
        }
    }
}
