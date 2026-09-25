# Kiro Spec Documentation - Angular MFE Transformation

This directory contains configuration and documentation for the Angular MFE Transformation project execution.

---

## 📁 Directory Structure

### Key Files

#### 1. **README.md** (This File)
- **Purpose**: Overview and navigation guide
- **When to read**: First time or for general reference
- **Contains**: File structure, quick start, workflow overview

#### 2. **TASK_WORKFLOW_COMPLETE.md** ⭐ START HERE
- **Purpose**: Complete workflow visualization with SKILL-COMMIT integration
- **When to read**: Before executing first task, to understand full flow
- **Contains**: Step-by-step workflow, timing diagrams, integration map

#### 3. **ERROR_MAP.md**
- **Purpose**: Central error tracking and prevention system
- **When to update**: After EVERY task execution (success or failure)
- **When to read**: BEFORE starting each new task
- **Contents**: 
  - All errors encountered with root causes
  - Solutions applied
  - Common patterns and prevention strategies
  - Statistics and cross-references

#### 4. **SUBAGENT_GUIDE.md**
- **Purpose**: Complete guide for delegating tasks to subagents
- **Who reads**: Orchestrator (coordinator)
- **Contents**:
  - How to invoke subagents correctly
  - What to expect in output
  - Error handling procedures
  - Best practices
  - Quality assurance checklist

#### 5. **POST_EXECUTION_GUIDE.md** ⭐ READ BEFORE SKILL-COMMIT
- **Purpose**: Complete guide to SKILL-COMMIT.md execution
- **When to read**: AFTER task successful, BEFORE running SKILL-COMMIT
- **Contents**:
  - What SKILL-COMMIT does (test, build, commit, push)
  - When to execute (only on success)
  - Pre-commit checklist
  - Step-by-step execution process
  - Error handling for SKILL-COMMIT failures
  - Troubleshooting guide

#### 6. **IMPLEMENTATION_SUMMARY.md**
- **Purpose**: Detailed summary of all changes made
- **When to read**: For understanding what was changed and why
- **Contents**:
  - Files created/modified
  - Requirements implemented
  - Errors mapped
  - Next actions

#### 7. **specs/angular-mfe-transformation/tasks.md**
- **Purpose**: Main task list with Execution Guidelines
- **New sections added**:
  - "Execution Guidelines & Error Management Protocol"
  - Pre-execution checklist
  - Post-task SKILL-COMMIT integration
  - Error documentation template
  - Common error categories and prevention
  - Complete task execution lifecycle

---

## 🚀 Quick Start - Complete Workflow

### 👀 FIRST TIME? Start Here:
1. Read **TASK_WORKFLOW_COMPLETE.md** (5 min) - Understand the full flow
2. Skim **POST_EXECUTION_GUIDE.md** (5 min) - Know what SKILL-COMMIT does

### 📋 FOR EACH TASK:

#### PHASE 1: Pre-Execution (5-10 min)
1. **Read ERROR_MAP.md** - Check for known issues
2. **Run Pre-Execution Checklist** - From tasks.md
   - [ ] Read ERROR_MAP.md
   - [ ] Check similar tasks
   - [ ] Verify dependencies
   - [ ] Confirm scripts exist
   - [ ] Check ports available
   - [ ] Verify files exist

#### PHASE 2: Task Execution (Variable)
1. **Invoke subagent** with full task context
2. **Monitor** for errors
3. **Document** any issues encountered

#### PHASE 3: Post-Execution (5-20 min)
1. **Update ERROR_MAP.md** - Document task completion
2. **Update tasks.md** - Mark task as completed
3. **Execute SKILL-COMMIT.md** ⚠️ MANDATORY
   - Verify: npm test
   - Verify: npm start
   - Verify: npm build
   - Commit: git add & commit
   - Push: git push

#### PHASE 4: Reporting (2-3 min)
1. **Report to user** - Task complete
2. **Ready for next task**

---

## 📚 Document Reference Guide

### By Use Case

| I want to... | Read This | Time |
|---|---|---|
| Understand complete workflow | TASK_WORKFLOW_COMPLETE.md | 10 min |
| Check for known errors | ERROR_MAP.md | 5 min |
| Execute a task | tasks.md + SUBAGENT_GUIDE.md | 15 min |
| Handle SKILL-COMMIT | POST_EXECUTION_GUIDE.md | 10 min |
| Understand what changed | IMPLEMENTATION_SUMMARY.md | 5 min |
| Run subagents | SUBAGENT_GUIDE.md | 10 min |
| Quick reference | README.md (this file) | 5 min |

### By Workflow Phase

| Phase | Read This First | Then This |
|---|---|---|
| Pre-Execution | ERROR_MAP.md | tasks.md checklist |
| Task Execution | SUBAGENT_GUIDE.md | tasks.md task details |
| Post-Execution | POST_EXECUTION_GUIDE.md | SKILL-COMMIT steps |
| Error Recovery | ERROR_MAP.md | SUBAGENT_GUIDE troubleshooting |

---

## 🎯 Key Mandatory Requirements

### ✅ Requirement 1: Always Use Subagents
- Documented in: tasks.md + SUBAGENT_GUIDE.md
- Enforced by: Orchestrator role definition
- Verified by: No direct code execution

### ✅ Requirement 2: Map All Errors
- Documented in: ERROR_MAP.md + tasks.md
- Enforced by: Error documentation template
- Verified by: Pre-task ERROR_MAP.md check

### ✅ Requirement 3: Check Errors Before Each Task
- Documented in: Pre-Execution Checklist (tasks.md)
- Enforced by: ERROR_MAP.md reference
- Verified by: Pre-flight checklist completion

### ✅ Requirement 4: Execute SKILL-COMMIT After Success
- Documented in: POST_EXECUTION_GUIDE.md + tasks.md
- Enforced by: Workflow requirement
- Verified by: Commit history in git

---

## 🔄 Complete Workflow Visualization

\\\
START TASK
    ↓
[Pre-Execution: 5-10 min]
  ├─ Read ERROR_MAP.md
  ├─ Run Pre-Execution Checklist
  └─ Verify dependencies
    ↓
[Task Execution: Variable]
  ├─ Invoke subagent
  ├─ Monitor execution
  └─ Document issues
    ↓
[Post-Execution on Success: 5-20 min]
  ├─ Update ERROR_MAP.md
  ├─ Update tasks.md (status=completed)
  ├─ Execute SKILL-COMMIT.md ⚠️
  │  ├─ npm test (all projects)
  │  ├─ npm start (verify)
  │  ├─ npm build (verify)
  │  └─ git commit & push
  └─ Report to user
    ↓
READY FOR NEXT TASK
\\\

---

## 📊 File Organization

\\\
.kiro/
├─ README.md (THIS FILE)
├─ TASK_WORKFLOW_COMPLETE.md ⭐ START HERE
├─ ERROR_MAP.md (Read BEFORE each task)
├─ SUBAGENT_GUIDE.md (Delegate tasks)
├─ POST_EXECUTION_GUIDE.md (SKILL-COMMIT)
├─ IMPLEMENTATION_SUMMARY.md (What changed)
└─ specs/
   └─ angular-mfe-transformation/
      └─ tasks.md (Updated with guidelines)
\\\

---

## ✨ Latest Updates

**Date**: 2026-09-25

### New Features Added:
1. ✅ SKILL-COMMIT.md integration to tasks.md
2. ✅ POST_EXECUTION_GUIDE.md created
3. ✅ TASK_WORKFLOW_COMPLETE.md created
4. ✅ Complete lifecycle documentation

### Integration Flow:
- Task completes → ERROR_MAP updated → tasks.md updated → SKILL-COMMIT executed → User reports

---

## 🆘 Need Help?

### I don't understand the workflow
→ Read **TASK_WORKFLOW_COMPLETE.md**

### I need to check for known errors
→ Read **ERROR_MAP.md**

### I need to run a task
→ Read **SUBAGENT_GUIDE.md**

### I need to execute SKILL-COMMIT
→ Read **POST_EXECUTION_GUIDE.md**

### I'm stuck on an error
→ Search **ERROR_MAP.md** for similar error

### I want to understand everything that changed
→ Read **IMPLEMENTATION_SUMMARY.md**

---

## 🎉 You're All Set!

Everything is ready:
- ✅ Workflow documented
- ✅ Errors tracking system ready
- ✅ Subagent coordination documented
- ✅ SKILL-COMMIT integration complete
- ✅ Pre/post execution checklists defined

**Next Step**: Read **TASK_WORKFLOW_COMPLETE.md** to understand the flow, then execute your first task!

---
