package com.expense.service;

import com.expense.dto.ClaimDtos.AuditResponse;
import com.expense.dto.ClaimDtos.ClaimRequest;
import com.expense.dto.ClaimDtos.ClaimResponse;
import com.expense.dto.ClaimDtos.ManagerOption;
import com.expense.dto.ClaimDtos.ReviewRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;

/** Claim operations available to employees and managers. */
public interface ClaimService {

    ClaimResponse create(String email, ClaimRequest request);

    ClaimResponse update(String email, Long claimId, ClaimRequest request);

    void delete(String email, Long claimId);

    List<ManagerOption> managers();

    Page<ClaimResponse> employeeList(
            String email,
            String status,
            String search,
            Pageable pageable);

    Page<ClaimResponse> managerList(
            String email,
            String status,
            String employee,
            String from,
            String to,
            Pageable pageable);

    ClaimResponse review(String email, Long claimId, ReviewRequest request);

    List<AuditResponse> timeline(String email, Long claimId);

    ClaimResponse uploadReceipt(String email, Long claimId, MultipartFile file) throws IOException;

    Path receipt(String email, Long claimId) throws IOException;
}
