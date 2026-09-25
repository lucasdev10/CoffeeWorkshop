# ? QUICK START - Checklists & Templates

**Quick reference checklists for immediate use after task execution.**

---

## ?? Use This File For

Copy/paste templates and fast checklists for:
- Post-task data collection
- Error mapping
- SKILL-COMMIT verification

---

## ?? Checklist 1: After Task Completes (QUICK)

`
? Task completed?        [ ]
? Success or failure?    [ ] SUCCESS [ ] FAILURE
? Have error details?    [ ] (if failure)
? Check ERROR_MAP.md?    [ ] 
? Error similar exist?   [ ] YES [ ] NO
? Use solution?          [ ] (if YES)
? Document entry?        [ ]
? Update statistics?     [ ]
? task_update() called?  [ ]
? SKILL-COMMIT exec?     [ ] (if success)
? Report to user?        [ ]
`

---

## ?? Template 1: SUCCESS Entry (Copy/Paste)

\\\markdown
### Task X.X - Task Name

**Date**: 2026-09-25
**Status**: ? SUCCESS
**Severity**: N/A

**Summary**: [1 line summary]

**What Worked**:
- [Point 1]
- [Point 2]

**Commands Used**:
- npm test
- npm run build

**Pattern For**: [Reusable for similar tasks]
\\\

---

## ?? Template 2: FAILURE Entry (Copy/Paste)

\\\markdown
### Task X.X - Task Name

**Date**: 2026-09-25
**Status**: ? FAILURE
**Severity**: ?? MAJOR
**Error Type**: Command / Code / Test / Build / Dependency

**Error**: [Copy exact message]

**Command**: npm [command that failed]

**Root Cause**: [Why]

**Solution**: [How to fix or PENDING]

**Prevention**:
- [ ] Check [item 1]
- [ ] Check [item 2]

**Similar To**: [Previous tasks]
\\\

---

## ?? Checklist 2: Update Statistics

After adding error entry to ERROR_MAP.md:

`
? Increment Total: +1
? Severity:
   [ ] Critical +1
   [ ] Major +1
   [ ] Minor +1
? Category:
   [ ] Command +1
   [ ] Code +1
   [ ] Test +1
   [ ] Build +1
   [ ] Dependency +1
`

---

## ?? Checklist 3: Before Next SIMILAR Task

`
? Open ERROR_MAP.md
? Search for similar error (by type/task)
? Found? YES [ ] NO [ ]
? If YES: Read prevention strategy
? If YES: Apply prevention BEFORE starting
? Document result when done
`

---

## ?? Checklist 4: Execute SKILL-COMMIT

`
? Task status = 'completed'?    [ ]
? ERROR_MAP.md shows no FAILURE? [ ]
? disclose_context() ready?      [ ]
? invoke_sub_agent() ready?      [ ]

After execution:
? npm test passed?      [ ]
? npm build passed?     [ ]
? npm start OK?         [ ]
? git commit created?   [ ]
? git push succeeded?   [ ]
`

---

## ?? Document Cross-Reference

| Need | Document | Time |
|------|----------|------|
| Overview | README.md | 2 min |
| Main workflow | ORCHESTRATOR_WORKFLOW.md | 10 min |
| Error mapping details | ERROR_MAPPING_GUIDE.md | 10 min |
| Error repo | ERROR_MAP.md | 5 min |
| SKILL-COMMIT details | SKILL_EXECUTION_GUIDE.md | 5 min |
| Error system | ERROR_MANAGEMENT_SYSTEM.md | 2 min |
| Subagents | SUBAGENT_GUIDE.md | 5 min |
| This quick ref | QUICK_START.md | 2 min |

---

## ?? Flow Shortcut (TL;DR)

1. Task done ? Collect data
2. Check ERROR_MAP.md ? Error similar?
3. Document (use templates above)
4. task_update() ? status = 'completed'
5. disclose_context(\"SKILL-COMMIT\") ? invoke_sub_agent()
6. Wait ? Report done

---

## ?? Quick Links

**Common tasks**:
- How to document error: ERROR_MAPPING_GUIDE.md
- How to run SKILL-COMMIT: SKILL_EXECUTION_GUIDE.md
- Full workflow: ORCHESTRATOR_WORKFLOW.md
- Error repository: ERROR_MAP.md

---

**Version**: 1.0 (Consolidated)  
**Last Updated**: 2026-09-25  
**Use**: For quick reference during task execution
