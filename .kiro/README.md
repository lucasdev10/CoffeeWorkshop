# ?? Kiro Spec Documentation - Angular MFE Transformation

Navigation guide for orchestrator task execution, error management, and SKILL-COMMIT workflow.

---

## ?? Core Documents (8 Files)

### 1. **README.md** (This File) - 2 min
**Purpose**: Navigation and overview  
**Start**: Yes, first time  
**Contains**: File structure, quick start, workflow overview

---

### 2. **ORCHESTRATOR_WORKFLOW.md** - 10 min ? START HERE!
**Purpose**: Main workflow for post-task execution (MASTER DOCUMENT)  
**Start**: Before executing first task  
**Contains**:
- Complete 6-step post-task workflow
- Data collection (STEP A)
- ERROR_MAP.md verification (STEP B)
- Error documentation (STEP C)
- Task status update (STEP D)
- SKILL-COMMIT execution (STEP E)
- User reporting (STEP F)
- Complete checklist

**When to use**: After EVERY task execution

---

### 3. **QUICK_START.md** - 2 min
**Purpose**: Fast templates and checklists  
**Start**: When executing tasks  
**Contains**:
- Copy/paste templates for SUCCESS and FAILURE entries
- Quick checklists (post-task, error, SKILL-COMMIT)
- Statistics update checklist
- Document cross-reference table

**When to use**: During task execution for quick reference

---

### 4. **ERROR_MANAGEMENT_SYSTEM.md** - 2 min
**Purpose**: Overview of error system  
**Start**: Before first error mapping  
**Contains**:
- System overview in few words
- 3 usage scenarios (new error, repetition, success)
- 5 error categories explained
- Document relationships diagram
- Reading order

**When to use**: To understand the error system

---

### 5. **ERROR_MAPPING_GUIDE.md** - 10 min
**Purpose**: Detailed error documentation guide  
**Start**: When documenting first error  
**Contains**:
- 6 complete steps for error mapping
- 5 error categories with examples
- Template and checklist
- Prevention strategies
- Cross-referencing instructions

**When to use**: Detailed guidance for documenting errors

---

### 6. **SKILL_EXECUTION_GUIDE.md** - 5 min
**Purpose**: How to run SKILL-COMMIT  
**Start**: When task succeeds  
**Contains**:
- 3-step SKILL-COMMIT execution
- Example workflow
- Verification checklist
- Error handling
- Integration with ORCHESTRATOR_WORKFLOW.md

**When to use**: When executing SKILL-COMMIT

---

### 7. **ERROR_MAP.md** - 5 min (Consulta rápida)
**Purpose**: Central error repository  
**Start**: Before each similar task  
**Contains**:
- All documented errors (error entries)
- Common patterns & solutions
- Statistics tracking
- Task-to-error index

**When to use**:
- BEFORE task: Check for similar errors
- AFTER task: Add new error (if needed)
- ANY TIME: Find solution for known errors

---

### 8. **SUBAGENT_GUIDE.md** - 5 min
**Purpose**: How to use subagents  
**Who reads**: Orchestrator  
**Contains**:
- When/how to invoke subagents
- What to expect in output
- Error handling
- Quality checklist
- Best practices

**When to use**: When delegating tasks to subagents

---

## ?? Quick Start - 3 Scenarios

### Scenario 1: FIRST TIME SETUP

1. Read **README.md** (this file) - 2 min
2. Read **ORCHESTRATOR_WORKFLOW.md** - 10 min
3. Read **ERROR_MANAGEMENT_SYSTEM.md** - 2 min
4. Bookmark **QUICK_START.md**
5. Bookmark **ERROR_MAP.md**

**Total**: 15 min to understand everything

---

### Scenario 2: EXECUTING FIRST TASK

1. Read **QUICK_START.md** Checklist 3: Before similar task
2. Read/skim **ERROR_MAP.md** - 5 min
3. Check: Similar errors exist?
4. Execute task via subagent
5. Follow **ORCHESTRATOR_WORKFLOW.md** STEP A-F

---

### Scenario 3: TASK JUST COMPLETED

1. Open **QUICK_START.md** - Checklist 1
2. Follow **ORCHESTRATOR_WORKFLOW.md** STEP A-F
3. If SUCCESS:
   - Read **SKILL_EXECUTION_GUIDE.md**
   - Execute SKILL-COMMIT
4. Report to user
5. Document in ERROR_MAP.md (use **QUICK_START.md** templates)

---

## ?? Post-Task Workflow (At a Glance)

`
Task Completes
    ?
ORCHESTRATOR_WORKFLOW STEP A: Collect Data
    +- Use QUICK_START.md Checklist 1
    +- Get: Task ID, status, errors (if any)
    ?
ORCHESTRATOR_WORKFLOW STEP B: Check ERROR_MAP.md
    +- Search for similar error
    +- Found? Use solution from ERROR_MAP.md
    +- Not found? Prepare new entry
    ?
ORCHESTRATOR_WORKFLOW STEP C: Document
    +- Use ERROR_MAPPING_GUIDE.md or QUICK_START.md template
    +- Add entry to ERROR_MAP.md
    +- Update statistics
    ?
ORCHESTRATOR_WORKFLOW STEP D: Update Status
    +- task_update(status='completed' or 'failed')
    ?
ORCHESTRATOR_WORKFLOW STEP E: SKILL-COMMIT (if SUCCESS)
    +- Use SKILL_EXECUTION_GUIDE.md
    +- disclose_context(\"SKILL-COMMIT\")
    +- invoke_sub_agent(...)
    ?
ORCHESTRATOR_WORKFLOW STEP F: Report
    +- Inform user of completion
`

---

## ??? File Organization

`
.kiro/
+-- README.md (you are here)
+-- ORCHESTRATOR_WORKFLOW.md (main workflow)
+-- QUICK_START.md (templates & checklists)
+-- ERROR_MANAGEMENT_SYSTEM.md (error system overview)
+-- ERROR_MAPPING_GUIDE.md (detailed error guide)
+-- SKILL_EXECUTION_GUIDE.md (SKILL-COMMIT execution)
+-- ERROR_MAP.md (central error repository)
+-- SUBAGENT_GUIDE.md (subagent instructions)
+-- specs/
    +-- angular-mfe-transformation/
        +-- tasks.md (main task list)
        +-- SKILL-COMMIT.md (the skill)
        +-- requirements.md
        +-- design.md
`

**Total**: 8 core documents (consolidated from 15+)

---

## ?? Navigation by Task

**"I need to understand the system"**
? ORCHESTRATOR_WORKFLOW.md

**"I need to do something quick"**
? QUICK_START.md

**"I need to handle an error"**
? ERROR_MANAGEMENT_SYSTEM.md ? ERROR_MAPPING_GUIDE.md

**"I need to check known errors"**
? ERROR_MAP.md

**"I need to execute SKILL-COMMIT"**
? SKILL_EXECUTION_GUIDE.md

**"I need to delegate a task"**
? SUBAGENT_GUIDE.md

---

## ? Key Principles

? **One Master Workflow**: ORCHESTRATOR_WORKFLOW.md  
? **One Error Repository**: ERROR_MAP.md  
? **One Quick Reference**: QUICK_START.md  
? **Minimal Files**: 8 core documents (consolidated)  
? **Clear Navigation**: Each document references others  

---

## ?? Document Consolidation

**Before**: 15+ files (scattered instructions)  
**After**: 8 files (organized system)  
**Result**: 47% reduction in files, 100% clarity increase

---

## ?? Start Now!

1. Read **ORCHESTRATOR_WORKFLOW.md** (10 min)
2. Bookmark **QUICK_START.md** and **ERROR_MAP.md**
3. Execute first task following the workflow
4. Use QUICK_START.md for immediate reference
5. Done! ?

---

**Version**: 2.0 (Consolidated)  
**Last Updated**: 2026-09-25  
**Status**: Ready for task execution
