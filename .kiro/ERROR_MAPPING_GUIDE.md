# ??? ERROR MAPPING GUIDE - Orchestrator Instructions

**Purpose**: Ensure ALL errors from task executions are documented para não repetir os mesmos erros.

**Responsibility**: Orchestrator documents EVERY task execution (success or failure) in ERROR_MAP.md.

---

## ?? When to Document Errors

### MANDATORY Documentation:
? **After EVERY task execution**, regardless of outcome:
- ? Task SUCCEEDED ? Document what worked (prevent future changes that break it)
- ? Task FAILED ? Document error with full details (prevent same error)
- ? Task had WARNINGS ? Document for reference

### When to ADD new entries:
`
Task completes (success OR failure)
    ?
Subagent reports result
    ?
Extract error details (if any)
    ?
Add entry to ERROR_MAP.md using template
    ?
Link to similar previous errors
    ?
Summarize prevention strategy
`

---

## ?? Quick Entry Template

\\\markdown
### Task ID: X.X - Task Name

**Date**: YYYY-MM-DD  
**Status**: ? SUCCESS / ? FAILURE  
**Severity**: ?? CRITICAL / ?? MAJOR / ?? MINOR

**Error Type**: (Command / Code / Test / Build / Dependency / None)
**Error Message**: [Full error message or "No errors"]

**Root Cause**: [Why it happened - 1-2 sentences]

**Solution**: [What was done to fix / What worked]

**Prevention**: [What to check next time / How to avoid]

**Command(s) Used**:
\\\ash
command 1
command 2
\\\

**Similar to**: [Previous task with same error, if any]
\\\

---

## ?? Full Entry Process

### STEP 1: Capture Error Details (During Execution)

**When subagent reports error, collect:**

`
? Task ID: [e.g., 6.2]
? Error Type: [Command / Code / Test / Build / Dependency]
? Full Error Message: [Complete error text from console]
? What Command Failed: [Exact npm or shell command]
? Stack Trace: [If available]
? File/Line Reference: [What file, what line]
? Context: [What step was executing when error occurred]
`

**Example from Subagent Output:**
`
Error: Test timed out in 5000ms
File: src/app/app.routes.spec.ts
Line: 125
Stack: at TestBed.inject() ? at loadRemoteModule()
Context: Running npm test in CoffeeWorkshop (Shell App)
Command: npm run test -- --run
`

### STEP 2: Analyze Root Cause

**Ask yourself:**
- ? WHY did this error occur?
- ? Is this a code issue, environment issue, or timing issue?
- ? What was the system doing when it failed?
- ? Have we seen this before? (Check ERROR_MAP.md)

**Document the answer** in concise terms:

`
Root Cause: Test timeout occurs because integration tests use 
firstValueFrom() with observables but have only 5000ms default timeout. 
ESM loader doesn't support HTTP URLs, only file:// schemes.
`

### STEP 3: Document Solution

**If Subagent Fixed It:**
`
Solution: Increased test timeout to 10000ms, mocked HTTP calls 
with vitest setup file, modified app.routes.spec.ts to mock 
loadRemoteModule instead of actually invoking it.
`

**If Error Wasn't Fixed:**
`
Status: ? PENDING RESOLUTION
Workaround: Skip this test for now, document in TODO
Next Step: Implement HTTP mocking strategy in next task
`

### STEP 4: Prevention Strategy

**Always include "what to check next time":**

`
Prevention Strategy:
1. Before running tests, verify vitest.config.ts timeout config
2. Check that ALL HTTP calls in tests are mocked
3. Ensure Module Federation remotes are not invoked in test env
4. Review similar test files for same pattern

Pre-flight Checklist:
- [ ] Check vitest.config.ts for test timeout
- [ ] Verify mock setup file exists
- [ ] Search codebase for other loadRemoteModule calls in tests
- [ ] Review package.json test script for --run flag
`

### STEP 5: Cross-Reference Similar Errors

**Search ERROR_MAP.md for:**
- Tasks with same error type
- Same error message
- Related components or files

**Example:**
`
Similar Errors:
- Task 5.7: Similar test timeout in cart MFE tests
- Task 7.7: ESM loader issues in auth MFE tests
- PATTERN: Integration tests with async operations timeout
`

### STEP 6: Update ERROR_MAP Statistics

**After adding entry, update section at bottom:**

`
## Statistics (UPDATE THESE)

- **Total Errors Recorded**: X (was Y)
- **By Severity**:
  - ?? Critical: X
  - ?? Major: X
  - ?? Minor: X
- **By Category**:
  - Command Errors: X
  - Code Errors: X
  - Test Errors: X
  - Build Errors: X
  - Dependency Errors: X
`

---

## ?? Common Errors Categories & Examples

### 1. COMMAND ERRORS
\\\
Error Type: npm script not found
Command: npm run build:ssr
Error Message: "npm ERR! Missing script: 'build:ssr'"

Root Cause: package.json doesn't have this script defined

Solution: Check package.json, add missing script or use correct name

Prevention: Verify package.json scripts before running any npm command
\\\

### 2. CODE ERRORS
\\\
Error Type: Import path incorrect
File: src/app/admin.routes.ts
Error Message: "Cannot find module '@/admin/pages' or extensions"

Root Cause: Path alias or barrel file not correctly configured

Solution: Update path to correct location or update barrel file export

Prevention: Verify all imports use correct paths, check tsconfig paths
\\\

### 3. TEST ERRORS
\\\
Error Type: Test timeout
File: src/app/product-flow.spec.ts
Error Message: "Error: Test timed out in 5000ms"

Root Cause: Test has async operation taking > 5 seconds

Solution: Increase timeout, mock external calls, or optimize test

Prevention: Mock all HTTP/external calls, use reasonable timeouts
\\\

### 4. BUILD ERRORS
\\\
Error Type: Webpack configuration conflict
Command: npm run build
Error Message: "Module Federation shared dependency version mismatch"

Root Cause: Two MFEs declaring same package with different versions

Solution: Align versions in all package.json files

Prevention: Requirement 17.1 - keep all versions consistent
\\\

### 5. DEPENDENCY ERRORS
\\\
Error Type: Peer dependency conflict
Command: npm install
Error Message: "@angular/core@21 requires typescript@5.2 but you have @5.1"

Root Cause: Inconsistent dependency versions

Solution: Update package.json to match required versions

Prevention: Run npm install --legacy-peer-deps, verify all have same versions
\\\

---

## ? ORCHESTRATOR CHECKLIST: After Each Task

**Use this checklist to ensure errors are properly documented:**

- [ ] Task has completed (success or failure)
- [ ] Subagent provided output/result
- [ ] **CHECK ERROR_MAP.md** - Did this error happen before?
- [ ] If NEW error:
  - [ ] Collected full error message
  - [ ] Identified error type (command/code/test/build/dependency)
  - [ ] Determined root cause
  - [ ] Documented solution (or "PENDING")
  - [ ] Added prevention strategy
  - [ ] Linked to similar errors
  - [ ] Updated statistics
- [ ] If KNOWN error (in ERROR_MAP.md):
  - [ ] Note task ID that repeated it
  - [ ] Add to "Similar tasks affected" section
  - [ ] Check if solution still works
- [ ] Format is consistent with template
- [ ] Entry has task ID, date, and status
- [ ] All fields completed (no empty sections)
- [ ] ERROR_MAP.md saved to .kiro/

---

## ?? Linking Errors Across Tasks

**When task 6.2 completes successfully:**
\\\markdown
### Task 6.2: Configure Admin MFE Module Federation

**Date**: 2026-09-25  
**Status**: ? SUCCESS  
**Severity**: N/A (no errors)

**Summary**: webpack.config.js created successfully for Admin MFE

**What Worked**:
- ModuleFederationPlugin configured correctly
- All shared dependencies marked as singletons
- Routes exposed properly

**Lessons Learned**:
- Pattern for shared dependency config works well
- Matches Products MFE pattern exactly

**Used Pattern**: Module Federation singleton pattern (see Task 5.2 for similar setup)
\\\

**When task 7.2 encounters same error as 6.2:**
\\\markdown
### Task 7.2: Configure Auth MFE Module Federation

**Status**: ? SUCCESS (after applying known fix)
**Similar to**: Task 6.2

**Note**: Used same pattern as Task 6.2, no issues encountered
\\\

---

## ?? ERROR_MAP.md Structure

\\\
ERROR_MAP.md
+-- How to Use This Document
+-- Index of Tasks with Errors (table)
+-- ENTRY 1: [Task ID] - First Task Error
¦   +-- Error Details
¦   +-- Root Cause Analysis
¦   +-- Solution Applied
¦   +-- Prevention Strategy
¦   +-- Related Errors
+-- ENTRY 2: [Task ID] - Second Task Error
+-- Common Patterns & Solutions
¦   +-- Pattern 1: Port Already in Use
¦   +-- Pattern 2: Missing npm Scripts
¦   +-- ...
+-- Statistics (updated after each task)
+-- Notes section
\\\

---

## ?? Goal: Break the Error Cycle

**Before (Without ERROR_MAP.md):**
`
Task 5.2 fails with error X ? Fix it ? Move to task 6.2
Task 6.2 fails with same error X ? Fix it again ? Move to 7.2
Task 7.2 fails with same error X ? Fix it again ??
`

**After (With ERROR_MAP.md):**
`
Task 5.2 fails with error X ? Document in ERROR_MAP.md
Task 6.2 ? Check ERROR_MAP.md ? Find solution from 5.2 ? Apply it first
Task 7.2 ? Check ERROR_MAP.md ? Prevention strategy prevents error entirely ?
`

---

## ?? When in Doubt

**Questions to ask before documenting:**

1. ? Have I seen this error before? ? Check ERROR_MAP.md index
2. ? What was the exact command that failed? ? Document it
3. ? What was the error message? ? Copy full text
4. ? Why did it happen? ? Technical explanation
5. ? How was it fixed? ? Step-by-step solution
6. ? How can we avoid this next time? ? Prevention strategy

---

**Remember**: ERROR_MAP.md is a living document. Update it EVERY time a task completes, whether successful or not. This breaks the cycle of repeating the same errors.

**Last Updated**: 2026-09-25  
**Document Version**: 1.0  
**Status**: Required for all orchestrator operations

