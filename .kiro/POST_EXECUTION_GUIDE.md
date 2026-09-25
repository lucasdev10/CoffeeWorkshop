# Post-Execution Guide - SKILL-COMMIT Integration

Complete guide for post-task execution procedures using SKILL-COMMIT.md

---

## 📋 Overview

After successfully completing a task, SKILL-COMMIT.md MUST be executed to:
1. Verify all changes are working correctly (tests, startup, build)
2. Commit all modified files to git
3. Push changes to repository
4. Prepare for next task execution

---

## 🎯 When to Execute SKILL-COMMIT

### Trigger Conditions
- ✅ Task completed successfully
- ✅ Subagent reports: "Task completed"
- ✅ All tests pass in the task
- ✅ ERROR_MAP.md updated (no blocking errors)
- ❌ Do NOT execute if task failed or has errors

### When NOT to Execute
- ❌ Task execution failed
- ❌ Errors encountered that need fixing
- ❌ Awaiting user decision on error resolution
- ❌ Missing prerequisite tasks

---

## 📝 Pre-Commit Checklist

**Before running SKILL-COMMIT.md, verify:**

- [ ] Task status updated to ✅ COMPLETED in tasks.md
- [ ] ERROR_MAP.md updated with execution details
- [ ] All generated files are in correct locations
- [ ] No error entries marked as FAILURE status
- [ ] Subagent confirmed successful completion
- [ ] Ready to commit changes

---

## 🚀 How to Execute SKILL-COMMIT

### Method 1: Manual Execution (Recommended for Orchestrator)

Run the SKILL-COMMIT.md skill from the command line:

`ash
# From workspace root
# SKILL-COMMIT.md will automatically:
# 1. Find all modified projects
# 2. Run npm test in each
# 3. Run npm start (verify)
# 4. Run npm run build
# 5. Commit changes
# 6. Push to repo
`

### Method 2: Automated by Orchestrator

After task completion:

`
1. Orchestrator detects: Task status = 'completed'
2. Orchestrator executes: SKILL-COMMIT workflow
3. SKILL-COMMIT runs tests and build in affected projects
4. Changes committed automatically
5. Orchestrator reports completion to user
`

---

## ✅ SKILL-COMMIT Verification Steps

The SKILL-COMMIT.md performs these checks:

### Step 1: Identify Modified Projects
`
Find all projects with changes:
- coffee-shared-lib (if files modified)
- coffee-shell-app (if files modified)
- coffee-products-mfe (if files modified)
- coffee-cart-mfe (if files modified)
- coffee-admin-mfe (if files modified)
- coffee-auth-mfe (if files modified)
- coffee-user-mfe (if files modified)
`

### Step 2: Run Tests
`ash
# In each affected project:
npm run test

✅ All tests must pass
❌ If any fail, SKILL-COMMIT will report and not proceed to commit
`

### Step 3: Run Startup
`ash
# In each affected project (for MFEs):
npm start

✅ Server must start without errors
✅ No critical console errors
❌ If fails, SKILL-COMMIT reports issue
`

### Step 4: Run Build
`ash
# In each affected project:
npm run build

✅ Build must complete successfully
✅ No critical build warnings (only minor OK)
❌ If fails, SKILL-COMMIT reports issue
`

### Step 5: Commit Changes
`ash
# If all tests/builds pass:
git add .
git commit -m "[Task ID] - [Task Name]

- Modified files: [list]
- Tests: PASSED
- Build: PASSED
- Reason: [Task completion]"

git push origin [branch]
`

---

## 📊 SKILL-COMMIT Execution Flow

`
┌─────────────────────────────────┐
│ Task Completed Successfully     │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│ Pre-Commit Checklist Passed?    │
└────────────┬────────────────────┘
             │
      ┌──────┴──────┐
      │             │
      ↓ YES         ↓ NO
   PROCEED      STOP & REPORT
      │             │
      ↓             └──→ Report to user
┌─────────────────────┐   Wait for action
│ Identify Modified   │
│ Projects            │
└────────┬────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ Run npm test in each project    │
│ ✅ All pass?                     │
└────────────┬────────────────────┘
      ┌──────┴──────┐
      │             │
      ↓ YES         ↓ NO
   PROCEED      STOP
      │          └──→ Report failures
      │              Report to user
      ↓              Await decision
┌─────────────────────────────────┐
│ Run npm start (verification)    │
│ ✅ Startup OK?                   │
└────────────┬────────────────────┘
      ┌──────┴──────┐
      │             │
      ↓ YES         ↓ NO
   PROCEED      STOP
      │          └──→ Report startup failure
      │
      ↓
┌─────────────────────────────────┐
│ Run npm run build               │
│ ✅ Build successful?             │
└────────────┬────────────────────┘
      ┌──────┴──────┐
      │             │
      ↓ YES         ↓ NO
   PROCEED      STOP
      │          └──→ Report build failure
      │
      ↓
┌─────────────────────────────────┐
│ All Checks Passed? ✅            │
│ Proceed to Commit                │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│ git add . (stage all changes)   │
│ git commit -m "[Task] - [Name]" │
│ git push origin [branch]         │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│ ✅ Commit & Push Successful      │
│ Report completion to user       │
└─────────────────────────────────┘
`

---

## 🔴 Error Handling in SKILL-COMMIT

### If Test Fails
`
1. SKILL-COMMIT stops execution
2. Reports which project & test failed
3. Reports failure to orchestrator
4. User must fix test failures
5. Retry SKILL-COMMIT after fixes
`

### If Build Fails
`
1. SKILL-COMMIT stops execution
2. Reports build error details
3. Reports failure to orchestrator
4. User must fix build issues
5. Retry SKILL-COMMIT after fixes
`

### If Startup Fails
`
1. SKILL-COMMIT stops execution
2. Reports startup failure
3. Reports failure to orchestrator
4. User must fix startup issues
5. Retry SKILL-COMMIT after fixes
`

---

## 📝 Commit Message Format

SKILL-COMMIT creates standardized commit messages:

`
[Task ID] - [Task Name]

- Modified projects: [List of projects changed]
- Test status: PASSED ✅
- Build status: PASSED ✅
- Startup status: [PASSED or N/A]
- Changes: [Brief description of what changed]

Task completed as per requirements:
- Requirement refs: [List of requirements met]
- Time taken: [Duration]
- Error count: [0 or number if any]
`

---

## 🔗 Integration Points

### With tasks.md
- Triggered after task status = 'completed'
- Reads task details from tasks.md
- Updates git with task metadata

### With ERROR_MAP.md
- Checks ERROR_MAP.md for task status
- Only proceeds if no FAILURE status
- Reports results back to ERROR_MAP.md

### With Orchestrator
- Orchestrator calls SKILL-COMMIT after task completion
- Receives success/failure status
- Proceeds to next task or reports error

---

## 🎯 Best Practices

### For Orchestrator
✅ Wait for complete task success before triggering SKILL-COMMIT  
✅ Verify ERROR_MAP.md shows success status  
✅ Ensure all files generated are correct before committing  
✅ Use standardized commit messages  
✅ Monitor SKILL-COMMIT output for any warnings  

### For Task Execution
✅ Ensure all generated code passes tests  
✅ Verify build completes without errors  
✅ Check startup works without critical errors  
✅ Leave no uncommitted changes after task  
✅ Keep commits atomic and focused  

### For Error Recovery
✅ If SKILL-COMMIT fails, fix the underlying issue first  
✅ Don't attempt to skip or force commit  
✅ Re-run tests locally before retrying SKILL-COMMIT  
✅ Update ERROR_MAP.md with any SKILL-COMMIT issues  

---

## 📋 Post-Commit Checklist

After SKILL-COMMIT completes successfully:

- [ ] All changes committed to git
- [ ] Push to remote completed
- [ ] Task marked as completed in tasks.md
- [ ] ERROR_MAP.md shows no FAILURE status
- [ ] Commit message contains task ID and name
- [ ] No uncommitted changes remain
- [ ] Ready to execute next task

---

## 🆘 Troubleshooting SKILL-COMMIT

### Issue: "npm test" fails in a project

**Solution:**
1. Identify which project failed
2. Run tests locally to debug
3. Fix test issues
4. Verify tests pass locally
5. Re-run SKILL-COMMIT.md

### Issue: "npm run build" fails

**Solution:**
1. Check build error message
2. Verify webpack.config.js
3. Check for Module Federation conflicts
4. Run build locally to debug
5. Fix build issues
6. Re-run SKILL-COMMIT.md

### Issue: "npm start" fails or times out

**Solution:**
1. Check port availability
2. Verify configuration
3. Check for console errors
4. Run startup locally
5. Fix startup issues
6. Re-run SKILL-COMMIT.md

### Issue: Git push fails

**Solution:**
1. Check network connectivity
2. Verify git credentials
3. Check if branch is up to date
4. Pull latest changes: git pull
5. Resolve conflicts if any
6. Re-run SKILL-COMMIT.md

---

## 📊 Execution Statistics

Track SKILL-COMMIT executions in ERROR_MAP.md:

`
## SKILL-COMMIT Executions
- Total runs: [Count]
- Successful: [Count]
- Failed: [Count]
- Average duration: [Time]
- Most common failure: [Type]
`

---

## 🎉 Success Indicators

SKILL-COMMIT completed successfully when:

✅ All tests pass  
✅ All builds succeed  
✅ Startup verification complete  
✅ Changes committed to git  
✅ Push to remote successful  
✅ No error messages reported  
✅ Task marked complete in tasks.md  

---

**Documentation Version**: 1.0  
**Last Updated**: 2026-09-25  
**Status**: Ready for Use
