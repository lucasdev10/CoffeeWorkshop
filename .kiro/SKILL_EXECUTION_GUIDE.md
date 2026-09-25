# ?? SKILL EXECUTION GUIDE - Running SKILL-COMMIT

**How to execute SKILL-COMMIT after task completion to verify and commit changes.**

---

## ?? When to Execute SKILL-COMMIT

**TRIGGER**: After STEP D in ORCHESTRATOR_WORKFLOW.md

**Only if**:
- ? task_update(status='completed') succeeded
- ? No FAILURE status in ERROR_MAP.md
- ? All task files created/modified

**Do NOT execute if**:
- ? Task status = failed
- ? FAILURE in ERROR_MAP.md
- ? Blockers remain

---

## ?? How to Execute SKILL-COMMIT

### 3-Step Process

#### STEP 1: Load SKILL-COMMIT Skill

\\\python
disclose_context(name=\"SKILL-COMMIT\")
\\\

This loads the SKILL-COMMIT.md instructions from:
\.kiro/specs/angular-mfe-transformation/SKILL-COMMIT.md\

#### STEP 2: Execute as Subagent

\\\python
invoke_sub_agent(
    name=\"spec-task-execution\",
    prompt=\"Execute SKILL-COMMIT.md: run tests, build, and commit all changes from this task\",
    explanation=\"Verify task changes work correctly (tests pass, build succeeds) and commit to git\"
)
\\\

#### STEP 3: Wait for Completion

SKILL-COMMIT will:
1. ? Run \
pm test\ in affected projects
   - All tests must pass
   - If fail: Report error, stop
2. ? Run \
pm run build\ in affected projects
   - Build must complete successfully
   - If fail: Report error, stop
3. ? Run \
pm start\ (MFE verification)
   - Server must start without critical errors
   - If fail: Report error, stop
4. ? Git commit all changes
   - Commit message: \"[Task ID] - [Task Name] - tests passed, build successful\"
5. ? Git push to remote
   - Changes pushed to repository
   - If fail: Report git error

---

## ?? Example Workflow: Task 6.2 Completed

**Scenario**: Task 6.2 \"Configure Admin MFE Module Federation\" completed successfully

### Timeline

`
Task 6.2 execution completes ?
    ?
ORCHESTRATOR_WORKFLOW STEP D:
  task_update(status='completed', taskId='6.2...')
    ?
ORCHESTRATOR_WORKFLOW STEP E:
  Check: task status = 'completed'? YES ?
    ?
SKILL_EXECUTION_GUIDE STEP 1:
  disclose_context(name=\"SKILL-COMMIT\")
    ? SKILL-COMMIT loaded
    ?
SKILL_EXECUTION_GUIDE STEP 2:
  invoke_sub_agent(name=\"spec-task-execution\", prompt=\"Execute SKILL-COMMIT...\")
    ? Subagent starts
    ?
SKILL-COMMIT Execution:
  1. npm test (coffee-admin-mfe) ? ? PASSED
  2. npm run build (coffee-admin-mfe) ? ? PASSED
  3. npm start (coffee-admin-mfe) ? ? Started successfully
  4. git add . ? ? Staged all changes
  5. git commit -m \"[6.2] - Configure Admin MFE Module Federation...\" ? ? Committed
  6. git push ? ? Pushed to origin
    ?
SKILL_EXECUTION_GUIDE STEP 3:
  Wait for completion
    ?
ORCHESTRATOR_WORKFLOW STEP F:
  ? Report: \"Task 6.2 completed and committed!\"
`

---

## ? Verification Checklist During Execution

While SKILL-COMMIT is running, verify:

- [ ] \
pm test\ output shows all tests passing
- [ ] \
pm run build\ completes without errors
- [ ] \
pm start\ starts server without critical errors
- [ ] Git commit created with task ID in message
- [ ] Git push succeeded (no auth errors)

---

## ?? Error Handling

### If npm test fails

`
? Tests failed in coffee-admin-mfe
   ? SKILL-COMMIT stops
   ? Report: \"Tests failed in [project]\"
   ? User must fix tests
   ? Re-run SKILL-COMMIT after fixes
`

### If npm run build fails

`
? Build failed in coffee-admin-mfe
   ? SKILL-COMMIT stops
   ? Report: \"Build failed: [error message]\"
   ? User must fix build issues
   ? Re-run SKILL-COMMIT after fixes
`

### If npm start fails

`
? Startup failed in coffee-admin-mfe
   ? SKILL-COMMIT stops
   ? Report: \"Server failed to start: [error]\"
   ? User must fix startup issues
   ? Re-run SKILL-COMMIT after fixes
`

### If git push fails

`
? Git push failed
   ? SKILL-COMMIT stops
   ? Report: \"Git push failed: [error]\"
   ? Possible causes:
      - Network issues
      - Git credentials
      - Branch out of date
   ? User must resolve
   ? Re-run SKILL-COMMIT after fixes
`

---

## ?? Complete Workflow Integration

**How SKILL_EXECUTION_GUIDE fits in the complete workflow:**

`
ORCHESTRATOR_WORKFLOW
    STEP A: Collect Data
    STEP B: Check ERROR_MAP.md
    STEP C: Document
    STEP D: Update Status
    ?
    ? If SUCCESS:
    ?
    STEP E: Execute SKILL-COMMIT
    ¦
    +-? SKILL_EXECUTION_GUIDE (this document)
    ¦   +- STEP 1: disclose_context
    ¦   +- STEP 2: invoke_sub_agent
    ¦   +- STEP 3: Wait for completion
    ¦
    +-? SKILL-COMMIT.md executes
        +- npm test
        +- npm run build
        +- npm start
        +- git commit
        +- git push
    ?
    STEP F: Report to User
`

---

## ?? Best Practices

### DO

? Always run SKILL-COMMIT after successful tasks  
? Wait for SKILL-COMMIT to complete fully  
? Verify test results before moving to next task  
? Check git push succeeded  
? Report completion to user  

### DON'T

? Skip SKILL-COMMIT for \"quick\" tasks  
? Interrupt SKILL-COMMIT while running  
? Commit changes manually (use SKILL-COMMIT)  
? Move to next task before SKILL-COMMIT completes  
? Ignore test failures  

---

## ?? Troubleshooting

**Issue**: \"disclose_context failed - SKILL-COMMIT not found\"
- Solution: Verify file exists: \.kiro/specs/angular-mfe-transformation/SKILL-COMMIT.md\
- Check exact spelling of skill name

**Issue**: \"Tests fail in SKILL-COMMIT but passed before\"
- Solution: Might be timing issue or flaky test
- Run tests manually to verify
- Re-run SKILL-COMMIT

**Issue**: \"Git push fails\"
- Solution: Check network, verify credentials
- Run: \git pull\ to get latest
- Re-run SKILL-COMMIT

---

## ?? Related Documents

- Main workflow: ORCHESTRATOR_WORKFLOW.md
- Skill details: SKILL-COMMIT.md
- Post-execution: POST_EXECUTION_GUIDE.md

---

**Version**: 1.0  
**Last Updated**: 2026-09-25  
**Status**: Consolidated from multiple sources
