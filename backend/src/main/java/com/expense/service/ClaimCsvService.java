package com.expense.service;

/** Creates CSV exports for manager claim lists. */
public interface ClaimCsvService {

    byte[] export(String managerEmail, String status, String employee, String from, String to);
}
