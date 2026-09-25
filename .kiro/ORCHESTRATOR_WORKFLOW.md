# ?? ORCHESTRATOR WORKFLOW - Main Execution Guide

**Master document for all post-task orchestrator actions (error mapping + SKILL-COMMIT).**

---

## ?? Overview: Post-Task Execution Workflow

After EVERY task completes (success or failure):

\\\
Task Execution Completes
    ?
STEP A: Coletar Dados
    +- Task ID, Success/Failure, Error details
    +- Use: QUICK_START.md checklist
    ?
STEP B: Verificar ERROR_MAP.md
    +- Procurar erro similar
    +- If found: Use known solution
    +- If not found: Prepare new entry
    ?
STEP C: Documentar Erro ou Sucesso
    +- Use: ERROR_MAPPING_GUIDE.md template
    +- Add entry ao ERROR_MAP.md
    +- Update statistics
    ?
STEP D: Atualizar Task Status
    +- task_update(status='completed' or 'failed')
    +- Update tasks.md
    ?
STEP E: Executar SKILL-COMMIT (se sucesso)
    +- Use: SKILL_EXECUTION_GUIDE.md
    +- disclose_context(name=\"SKILL-COMMIT\")
    +- invoke_sub_agent(...)
    ?
STEP F: Reportar ao User
    +- Mention ERROR_MAP.md entry + next steps
\\\

---

## ?? STEP A: Coletar Dados da Tarefa

**When subagent reports completion (success or failure):**

Collect from subagent output:
- ? Task ID (e.g., 6.2)
- ? Status: SUCCESS or FAILURE
- ? If error: Full error message
- ? If error: Command that failed
- ? If error: File/Line reference (if available)
- ? If error: Stack trace (if available)

**Checklist**:
- [ ] Have Task ID
- [ ] Have execution status
- [ ] If error: Have full error message
- [ ] If error: Have exact command
- [ ] If error: Have context/timing

---

## ?? STEP B: Verificar ERROR_MAP.md

**Before documenting, check if error already exists:**

1. **Open**: \.kiro/ERROR_MAP.md\
2. **Search for**: 
   - Same task ID (retry scenario)
   - Similar error message
   - Same command (e.g., npm test)
   - Similar error category
3. **If found**:
   - Note the solution from ERROR_MAP.md
   - Add current task ID to "Tasks Affected" section
   - Verify solution still works
   - Proceed to STEP C with known fix
4. **If not found**:
   - Mark as NEW error
   - Proceed to STEP C with full documentation

---

## ?? STEP C: Documentar Erro ou Sucesso

### C1: If Task SUCCEEDED

Add to ERROR_MAP.md:

\\\markdown
### Task X.X - Name

**Date**: 2026-09-25
**Status**: ? SUCCESS
**Severity**: N/A

**Summary**: [What was accomplished]

**What Worked**:
- [Point 1]
- [Point 2]

**Commands Used**:
- npm command 1
- npm command 2

**Pattern For**: [Reusable pattern for similar tasks]
\\\

### C2: If Task FAILED

Add to ERROR_MAP.md:

\\\markdown
### Task X.X - Name

**Date**: 2026-09-25
**Status**: ? FAILURE
**Severity**: ?? MAJOR (or CRITICAL/MINOR)
**Error Type**: Command / Code / Test / Build / Dependency

**Error Message**: [Full error text]

**Command Failed**: [Exact command]

**File/Line**: [If available]

**Root Cause**: [Why it happened]

**Solution**: [How to fix / PENDING if not fixed]

**Prevention Strategy**: 
1. [Check 1]
2. [Check 2]

**Similar To**: [Previous tasks with same error]
\\\

**Reference**: See ERROR_MAPPING_GUIDE.md for detailed guidance

### C3: Update Statistics

After adding entry, update ERROR_MAP.md statistics section:

\\\markdown
## Statistics

- Total Errors: [+1 if new error]
- By Severity:
  - Critical: [+1 if Critical]
  - Major: [+1 if Major]
  - Minor: [+1 if Minor]
- By Category:
  - Command: [+1 if Command Error]
  - Code: [+1 if Code Error]
  - Test: [+1 if Test Error]
  - Build: [+1 if Build Error]
  - Dependency: [+1 if Dependency Error]
\\\

---

## ?? STEP D: Atualizar Task Status

**Notify system that task status changed:**

\\\python
# If SUCCESS:
task_update(status='completed', taskId='X.X...')

# If FAILURE:
task_update(status='failed', taskId='X.X...')
`

This updates tasks.md and may trigger new ready tasks.

---

## ?? STEP E: Executar SKILL-COMMIT (Só se SUCCESS)

**ONLY if task status = 'completed' (SUCCESS):**

\\\python
# Step 1: Load the skill
disclose_context(name=\"SKILL-COMMIT\")

# Step 2: Execute as subagent
invoke_sub_agent(
    name=\"spec-task-execution\",
    prompt=\"Execute SKILL-COMMIT.md: run tests, build, and commit changes\",
    explanation=\"Verify and commit task changes to git\"
)
\\\

**What SKILL-COMMIT does**:
1. Runs npm test in affected projects
2. Runs npm run build verification
3. Runs npm start (MFE startup check)
4. Commits all changes to git
5. Pushes to repository

**Result**: All task changes committed and available

---

## ?? STEP F: Reportar ao User

### If SUCCESS:

\\\
? Task X.X completed and committed!
?? Documented in ERROR_MAP.md
?? Ready for next tasks: [list]
\\\

### If FAILURE:

\\\
? Task X.X failed
?? Error: [Brief message]
?? Documented in ERROR_MAP.md with prevention strategy
?? Next steps: [Suggestions for fix]
\\\

---

## ?? Complete Checklist: After Every Task

- [ ] STEP A: Collect task data (ID, status, error details)
- [ ] STEP B: Check ERROR_MAP.md for similar errors
- [ ] If new error: Continue to STEP C
- [ ] If known error: Use documented solution
- [ ] STEP C: Document in ERROR_MAP.md (use template)
- [ ] Update statistics
- [ ] Link related errors
- [ ] STEP D: task_update(status='completed' or 'failed')
- [ ] STEP E: If SUCCESS ? disclose_context + invoke_sub_agent
- [ ] STEP E: If FAILURE ? Skip SKILL-COMMIT
- [ ] STEP F: Report to user

---

## ?? Reference Documents

- **Quick actions**: QUICK_START.md
- **Error mapping details**: ERROR_MAPPING_GUIDE.md
- **Error repository**: ERROR_MAP.md
- **Skill execution**: SKILL_EXECUTION_GUIDE.md
- **Subagent details**: SUBAGENT_GUIDE.md

---

**Version**: 2.0 (Consolidated)  
**Last Updated**: 2026-09-25  
**Status**: Master workflow document
