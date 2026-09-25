# Complete Task Execution Workflow with SKILL-COMMIT

Visual guide showing the complete workflow from task start to completion with SKILL-COMMIT integration.

---

## 🔄 FULL WORKFLOW - Step by Step

\\\
╔════════════════════════════════════════════════════════════════════════════╗
║                     TASK EXECUTION COMPLETE WORKFLOW                       ║
╚════════════════════════════════════════════════════════════════════════════╝

PHASE 1: PRE-EXECUTION
═══════════════════════════════════════════════════════════════════════════

  Step 1️⃣  READ ERROR_MAP.md
           └─→ Check for known issues with similar tasks
           └─→ Identify prevention strategies
           └─→ Review solutions from previous errors

  Step 2️⃣  VERIFY PRE-EXECUTION CHECKLIST
           └─→ Read ERROR_MAP.md ✅
           └─→ Review similar completed tasks ✅
           └─→ Verify dependency alignment (req. 17.1) ✅
           └─→ Confirm package.json scripts exist ✅
           └─→ Check port availability ✅
           └─→ Verify referenced files exist ✅

  Step 3️⃣  UPDATE TASK STATUS
           └─→ task_update(status='in_progress')

PHASE 2: TASK EXECUTION
═══════════════════════════════════════════════════════════════════════════

  Step 4️⃣  INVOKE SUBAGENT
           └─→ name='spec-task-execution'
           └─→ Include full task context
           └─→ Attach relevant context files

  Step 5️⃣  MONITOR EXECUTION
           └─→ Watch subagent output
           └─→ Capture error details if any
           └─→ Note patterns and root causes

  Step 6️⃣  EXECUTION OUTCOME
           ├─→ SUCCESS: Continue to Phase 3
           └─→ FAILURE: Go to Error Handling
                      └─→ Document in ERROR_MAP.md
                      └─→ Report to user
                      └─→ Await decision (retry/fix/skip)

PHASE 3: POST-EXECUTION (ON SUCCESS)
═══════════════════════════════════════════════════════════════════════════

  Step 7️⃣  UPDATE ERROR_MAP.md
           └─→ Task: [Task ID] - [Task Name]
           └─→ Date: [YYYY-MM-DD]
           └─→ Status: ✅ SUCCESS
           └─→ Duration: [X minutes]
           └─→ Errors: (none if successful)
           └─→ Learnings: [Any insights]

  Step 8️⃣  UPDATE TASK STATUS
           └─→ task_update(status='completed')
           └─→ Parent tasks auto-complete if needed

  Step 9️⃣  EXECUTE SKILL-COMMIT.md ⚠️  MANDATORY
           └─→ Verify all changes working
           └─→ Run npm test (verify tests pass)
           └─→ Run npm start (verify startup)
           └─→ Run npm build (verify build)
           └─→ Commit changes to git
           └─→ Push to repository

  Step 🔟 REPORT TO USER
           └─→ Task completed successfully ✅
           └─→ Changes committed to git ✅
           └─→ Ready for next task

NEXT TASK → Return to Phase 1
═══════════════════════════════════════════════════════════════════════════
\\\

---

## ⏱️ TIMING DIAGRAM

\\\
TIMELINE:
═════════════════════════════════════════════════════════════════════════

START
  │
  ├─→ [5-10 min] Pre-execution checks (ERROR_MAP, checklist)
  │
  ├─→ [Variable] Task execution by subagent
  │              (5 min - several hours depending on task complexity)
  │
  ├─→ [2-5 min] Error mapping & documentation
  │
  ├─→ [5-15 min] SKILL-COMMIT execution
  │              ├─ npm test in all modified projects
  │              ├─ npm start verification
  │              ├─ npm build verification
  │              └─ git commit & push
  │
  ├─→ [2-3 min] Status updates & reporting
  │
  └─→ [1 min] Ready for next task

TOTAL PER TASK: 20 min - several hours (mostly task execution time)
               SKILL-COMMIT adds: 5-15 min

═════════════════════════════════════════════════════════════════════════
\\\

---

## 📊 PHASE COMPARISON

| Phase | Orchestrator | Subagent | Duration | Automation |
|-------|--------------|----------|----------|-----------|
| Pre-Execution | 100% | 0% | 5-10 min | Manual checklist |
| Task Execution | 5% (monitor) | 95% | Variable | Delegated |
| Error Mapping | 100% | 0% | 2-5 min | Manual or auto |
| SKILL-COMMIT | 10% (monitor) | 90% | 5-15 min | Automated |
| Reporting | 100% | 0% | 2-3 min | Manual |

---

## 🎯 SKILL-COMMIT DETAILS

### What SKILL-COMMIT.md Does

\\\
INPUT:
  - Modified projects from task execution
  - Task ID and name
  - List of changed files

PROCESS:
  1. Identify all projects with changes
  2. For each modified project:
     a. Run: npm run test
     b. Run: npm start (with timeout check)
     c. Run: npm run build
  3. If all checks pass:
     a. Stage all changes: git add .
     b. Create commit: git commit -m "[Task] message"
     c. Push to remote: git push origin [branch]
  4. Report results

OUTPUT:
  - ✅ All tests passed
  - ✅ Build successful
  - ✅ Changes committed
  - ✅ Ready for next task
  OR
  - ❌ Tests failed in [project]
  - ❌ Build failed in [project]
  - ❌ Startup failed in [project]
\\\

### When to Use SKILL-COMMIT

\\\
✅ EXECUTE when:
   - Task completed successfully
   - ERROR_MAP.md shows SUCCESS status
   - No blocking errors identified
   - Ready to commit changes
   - Ready to push to repository

❌ DO NOT EXECUTE when:
   - Task failed or has errors
   - ERROR_MAP.md shows FAILURE status
   - Awaiting error fix or user decision
   - Changes are incomplete
   - Need to investigate further
\\\

---

## 🔗 INTEGRATION MAP

\\\
                    ┌──────────────────────┐
                    │    START TASK        │
                    └──────────┬───────────┘
                               │
              ┌────────────────┴─────────────────┐
              │                                  │
              ↓                                  ↓
      ┌──────────────────┐           ┌──────────────────┐
      │  Pre-Execution   │           │   ERROR_MAP.md   │
      │  Checklist       │◄────────┐ │                  │
      │                  │         │ │ - Check patterns │
      │ • ERROR_MAP.md   │         │ │ - Review history │
      │ • Dependencies   │         │ │ - Get solutions  │
      │ • Ports          │         │ └──────────────────┘
      │ • Packages       │         │
      └────────┬─────────┘         │
               │                   │
               ↓                   │
      ┌──────────────────┐         │
      │  Subagent Task   │◄────────┘
      │  Execution       │
      │                  │
      │ (5 min - hours)  │
      └────────┬─────────┘
               │
         ┌─────┴─────┐
         │           │
    ✅ SUCCESS   ❌ FAILURE
         │           │
         ↓           └──→ Document Error
         │                Update ERROR_MAP
         │                Report to User
         │                Await Decision
         │
         ↓
      ┌──────────────────┐
      │ Update ERROR_MAP │
      │ (Document Task) │
      │ • Date: now      │
      │ • Status: SUCCESS│
      │ • Duration: X min│
      │ • Errors: none   │
      └────────┬─────────┘
               │
               ↓
      ┌──────────────────┐
      │  Update Tasks.md │
      │ status='completed'│
      └────────┬─────────┘
               │
               ↓
      ┌──────────────────┐
      │  SKILL-COMMIT    │ ⚠️  MANDATORY
      │  Execution       │
      │                  │
      │ • npm test       │
      │ • npm start      │
      │ • npm build      │
      │ • git commit     │
      │ • git push       │
      │                  │
      │ (5-15 min)       │
      └────────┬─────────┘
               │
         ┌─────┴──────┐
         │            │
    ✅ SUCCESS   ❌ FAILURE
         │            │
         ↓            └──→ Report Issue
         │                Fix Needed
         │                Retry SKILL-COMMIT
         │
         ↓
      ┌──────────────────┐
      │  Report to User  │
      │ • Task complete  │
      │ • Changes pushed │
      │ • Next task info │
      └────────┬─────────┘
               │
               ↓
      ┌──────────────────┐
      │  Next Task Ready │
      │ Return to START  │
      └──────────────────┘
\\\

---

## 🎓 KEY PRINCIPLES

### 1. ALWAYS Delegate to Subagents
- Orchestrator: Coordinator only
- Subagent: Implementation only
- Clear separation of concerns

### 2. ALWAYS Check ERROR_MAP Before Starting
- Prevents repeating known mistakes
- Reuses proven solutions
- Identifies patterns

### 3. ALWAYS Execute SKILL-COMMIT After Success
- Verifies all changes work
- Commits to version control
- Maintains clean repository

### 4. ALWAYS Document Everything
- Every error logged
- Every success documented
- Every lesson captured

---

## ✨ WORKFLOW BENEFITS

✅ **Consistency**: Every task follows same workflow  
✅ **Reliability**: Errors caught by SKILL-COMMIT tests  
✅ **Traceability**: Every change committed with context  
✅ **Knowledge**: ERROR_MAP preserves learnings  
✅ **Speed**: Second task faster than first (error prevention)  
✅ **Quality**: Tests guarantee working code  

---

**Last Updated**: 2026-09-25  
**Status**: Ready for Use
