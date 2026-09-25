# Error Map - Angular MFE Transformation

Central registry of all errors encountered during task execution. Use this document to:

- Track recurring issues
- Find solutions for similar problems
- Prevent repeating mistakes
- Learn from past execution attempts

**Last Updated**: 2026-09-25 15:05:00  
**Total Entries**: 1

---

## How to Use This Document

1. **Before starting a task**: Search for your task ID or similar task patterns
2. **During execution**: Monitor for errors that match known patterns
3. **After execution**: Add a new entry documenting any errors encountered
4. **Cross-reference**: Link related errors using task IDs

---

## Index of Tasks with Errors

| Task ID      | Task Name                         | Status     | Error Count | Last Updated |
| ------------ | --------------------------------- | ---------- | ----------- | ------------ |
| SKILL-COMMIT | Test Failures During Commit Skill | ❌ FAILURE | 2           | 2026-09-25   |

---

## Error Entries

### Entry 1: [TEMPLATE - Copy this for new errors]

**Task ID**: X.X - Task Name  
**Date**: YYYY-MM-DD  
**Status**: ✅ SUCCESS / ❌ FAILURE  
**Severity**: 🔴 CRITICAL / 🟠 MAJOR / 🟡 MINOR

#### Error Details

- **Error Type**: (Command Error / Code Error / Test Error / Build Error / Dependency Error / Other)
- **Error Message**: (Full error message or stack trace)
- **Context**: (What step was being executed when error occurred)

#### Root Cause Analysis

- **Why it happened**: (Technical explanation)
- **Environment factors**: (OS, versions, etc.)
- **Common pattern**: (If this is a recurring issue)

#### Solution Applied

- **What was tried**: (Steps taken to fix)
- **Final solution**: (What actually worked)
- **Workaround**: (If no permanent fix found)

#### Prevention Strategy

- **How to avoid**: (What to check before running similar tasks)
- **Pre-flight checklist**: (Specific checks to do)
- **Similar tasks affected**: (Other tasks that might encounter this)

#### Related Errors

- [Link to similar error entry if exists]
- [Reference to requirement that helps avoid this]

---

## Common Patterns & Solutions

### Pattern 1: Port Already in Use

**Occurs in**: MFE startup tasks (5.8, 6.7, 7.8, 8.8)  
**Solution**: Kill process or modify port number  
**Command**:
\\\powershell

# Find process using port

Get-NetTCPConnection -LocalPort 4202 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id \ -Force }
\\\

### Pattern 2: Missing npm Scripts

**Occurs in**: Any task running \
pm start\, \
pm test\, etc.  
**Solution**: Verify package.json has required scripts  
**Check**:
\\\ash
cat package.json | grep -A20 '"scripts"'
\\\

### Pattern 3: Import Path Errors

**Occurs in**: After migrating files to MFEs  
**Solution**: Verify barrel files (public-api.ts) export everything needed  
**Prevention**: Always update public-api.ts when adding new exports

### Pattern 4: Mock Store Issues

**Occurs in**: Component tests with NgRx  
**Solution**: Use provideMockStore from @ngrx/store/testing  
**Template**:
\\\ ypescript
TestBed.configureTestingModule({
providers: [provideMockStore({ initialState: ... })]
})
\\\

---

## Statistics

- **Total Errors Recorded**: 0
- **By Severity**:
  - 🔴 Critical: 0
  - 🟠 Major: 0
  - 🟡 Minor: 0
- **By Category**:
  - Command Errors: 0
  - Code Errors: 0
  - Test Errors: 0
  - Build Errors: 0
  - Dependency Errors: 0

---

## Notes

- This document is maintained throughout the entire transformation project
- Update after EVERY task execution (success or failure)
- Review this document before starting new tasks to prevent known issues
- Use descriptive, technical language for future reference
- Cross-link related errors for pattern recognition

### Entry 1: Test Timeout and ESM URL Scheme Errors

**Task ID**: SKILL-COMMIT - Test Execution Phase  
**Date**: 2026-09-25  
**Status**: ❌ FAILURE  
**Severity**: 🟠 MAJOR

#### Error Details

- **Error Type**: Test Error (Timeout) + Code Error (ESM URL Scheme)
- **Error Message 1**: "Error: Test timed out in 5000ms" in product-flow.spec.ts
  - Occurs in tests: "should apply free shipping for orders over threshold" and "should remove item and recalculate totals"
  - Line references: 398, 442
- **Error Message 2**: "Error: Only URLs with a scheme in: file and data are supported by the default ESM loader. Received protocol 'http:'"
  - Originates in app.routes.spec.ts
  - Related to loadRemoteModule attempting HTTP calls during test
- **Context**: CoffeeWorkshop (Shell App) test suite ran with `npm run test -- --run`
  - Test Files: 1 failed | 58 passed (59)
  - Tests: 5 failed | 763 passed (768)
  - Total duration: 38.79s

#### Root Cause Analysis

- **Why it happened**:
  1. Integration tests in product-flow.spec.ts use `firstValueFrom` with complex observables but have 5000ms default timeout
  2. app.routes.spec.ts tests that check loadRemoteModule functions are actually trying to invoke HTTP remote module loading during tests
  3. The ESM loader in the test environment (Vitest) doesn't support HTTP URLs, only file:// and data:// schemes
- **Environment factors**:
  - Node.js ESM loader in test environment
  - Vitest default test timeout: 5000ms
  - Module Federation remote modules configured for HTTP localhost URLs
- **Common pattern**:
  - Integration tests with async operations timing out
  - Tests that mock Module Federation without proper HTTP mocking strategy

#### Solution Applied

- **What was tried**: Running `npm run test -- --run` to identify failing tests
- **Final solution**: PENDING - Need to:
  1. Increase test timeout for integration tests
  2. Mock HTTP remote module loading in app.routes.spec.ts
  3. Add setup file to handle ESM URL scheme errors
- **Workaround**: Tests can be skipped temporarily for commit, then fixed in next iteration

#### Prevention Strategy

- **How to avoid**:
  1. Mock all remote module loading in test environment
  2. Use configurable timeouts for async integration tests
  3. Set up HTTP mock interceptors for Vitest before running tests
- **Pre-flight checklist**:
  - Check vitest.config.ts for test timeout configuration
  - Verify all HTTP calls are mocked in test setup
  - Ensure Module Federation remotes are not actually invoked in tests
- **Similar tasks affected**:
  - 5.7 Migrate Cart MFE unit tests
  - 6.6 Migrate Admin MFE unit tests
  - 7.7 Migrate Auth MFE unit tests
  - 8.7 Migrate User MFE unit tests

#### Related Errors

- Pattern: "Test timeout in integration tests" - Similar tests are timing out in product-flow.spec.ts
- Prevention: Implement HTTP mocking strategy similar to mock-http.service.ts
- Reference: Requirement 15.2 (Testing MFE communication)

---

## Statistics

- **Total Errors Recorded**: 1
- **By Severity**:
  - 🔴 Critical: 0
  - 🟠 Major: 1
  - 🟡 Minor: 0
- **By Category**:
  - Command Errors: 0
  - Code Errors: 1
  - Test Errors: 1
  - Build Errors: 0
  - Dependency Errors: 0
