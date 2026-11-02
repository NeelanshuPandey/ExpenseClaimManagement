package com.expense.service;

import com.expense.dto.ClaimDtos.ClaimResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class ClaimCsvService {
    private final ClaimService claims;
    public ClaimCsvService(ClaimService claims) { this.claims = claims; }

    public byte[] export(String managerEmail, String status, String employee, String from, String to) {
        List<ClaimResponse> rows = claims.managerList(managerEmail, status, employee, from, to, Pageable.unpaged()).getContent();
        StringBuilder csv = new StringBuilder("id,employee_name,employee_email,manager_name,title,amount,category,expense_date,status,description,manager_comment,receipt_file\r\n");
        for (ClaimResponse c : rows) {
            csv.append(c.id()).append(',')
                    .append(cell(c.employeeName())).append(',')
                    .append(cell(c.employeeEmail())).append(',')
                    .append(cell(c.managerName())).append(',')
                    .append(cell(c.title())).append(',')
                    .append(cell(c.amount()==null?"":c.amount().toPlainString())).append(',')
                    .append(cell(c.category())).append(',')
                    .append(cell(c.expenseDate()==null?"":c.expenseDate().toString())).append(',')
                    .append(cell(c.status())).append(',')
                    .append(cell(c.description())).append(',')
                    .append(cell(c.managerComment())).append(',')
                    .append(cell(c.receiptFileName())).append("\r\n");
        }
        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String cell(String value) {
        String safe = value == null ? "" : value;
        int first = 0;
        while (first < safe.length() && Character.isWhitespace(safe.charAt(first))) first++;
        if (first < safe.length() && "=+-@".indexOf(safe.charAt(first)) >= 0) safe = "'" + safe;
        return "\"" + safe.replace("\"", "\"\"") + "\"";
    }
}
