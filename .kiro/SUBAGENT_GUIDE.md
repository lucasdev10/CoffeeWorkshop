# Subagent Execution Guide

Complete guide for using subagents for all task implementations in the Angular MFE Transformation project.

---

## Core Principle

**ORCHESTRATOR**: Only coordinates, manages status, reads errors  
**SUBAGENT**: Executes ALL implementation work

---

## Subagent Types & When to Use

### 1. spec-task-execution (Main Implementation Subagent)

**When to use**: For implementing any task in the transformation  
**Responsibilities**:
- Write code
- Run tests
- Build projects
- Create files and directories
- Run npm commands
- Handle git operations

**Required Input**:
- Task ID (e.g., "5.7 Migrate Cart MFE unit tests")
- Task description (from tasks.md)
- Spec path (file path to tasks.md)
- Context files (if needed)

**Expected Output**:
- ✅ SUCCESS: Task completed, tests pass, files created
- ❌ FAILURE: Error message, attempted solutions, logs

---

## Execution Workflow

### Step 1: Pre-Execution Check (Orchestrator)
`
1. Call task_get to get task state
2. Call task_list with status='ready' to confirm task is ready
3. Read ERROR_MAP.md to check for known issues
4. Verify prerequisite tasks are completed
`

### Step 2: Update Task Status (Orchestrator)
`
Call task_update with status='in_progress' for the task
`

### Step 3: Invoke Subagent (Orchestrator)
`
Call invoke_sub_agent with:
- name: 'spec-task-execution'
- prompt: [Detailed task description]
- contextFiles: [Relevant files for context]
- explanation: [Brief explanation of why delegating]
`

### Step 4: Monitor Subagent (Orchestrator)
`
Monitor subagent output for:
- Successful completion
- Errors encountered
- Files created/modified
- Test results
`

### Step 5: Post-Execution (Orchestrator)
`
1. If SUCCESS: 
   - Call task_update with status='completed'
   - Update ERROR_MAP.md (no errors section)
   
2. If FAILURE:
   - DON'T retry automatically
   - Document error in ERROR_MAP.md
   - Report to user with details
   - Await user decision (retry/fix/skip)
`

---

## Subagent Prompt Template

When delegating a task to spec-task-execution:

`markdown
Execute task [TASK_ID] from the Angular MFE Transformation spec:

**Task ID**: [X.X - Task Name]

**Task Description**:
[Copy from tasks.md]

**Context**:
- Previous tasks completed: [List]
- Dependencies: [List what must exist]
- Relevant files: [List key files]

**Requirements References**:
[Requirements from task]

**Success Criteria**:
- [Criterion 1]
- [Criterion 2]
- [All tests pass]

**If Errors Occur**:
1. Document the error
2. Try alternative approach if applicable
3. Report error details to user

What to do:
[Specific instructions for implementation]
`

---

## Error Handling by Subagent

### When Subagent Encounters an Error

Subagent should:
1. **Document** the error immediately:
   - Full error message
   - Commands that triggered it
   - Stack trace if applicable

2. **Attempt solutions** (1-2 tries max):
   - Try alternative commands
   - Check prerequisites
   - Verify file structure

3. **Report to orchestrator**:
   - Full error details
   - What was tried
   - Current state of files/project
   - Whether task is recoverable

### Orchestrator's Error Response

When receiving error from subagent:
1. **Do NOT** retry automatically
2. **Document** error in ERROR_MAP.md
3. **Report** to user with:
   - Error details
   - Root cause analysis
   - Suggested next steps
4. **Await** user decision:
   - Retry with specific fix
   - Skip task
   - Investigate further

---

## Parallel Subagent Execution

### Concurrent Tasks
- **Maximum**: 5 concurrent subagent invocations
- **Coordination**: Track all task IDs in progress
- **Monitoring**: Check each subagent's status independently

### Managing Multiple Tasks
`
1. Get all ready tasks (task_list status='ready')
2. For each ready task (up to 5):
   a. Call task_update status='in_progress'
   b. Invoke subagent in parallel
3. Monitor all subagent outputs
4. On completion of each:
   a. Update task status
   b. Record any errors
5. If more ready tasks exist:
   a. Wait for current batch to complete
   b. Start next batch (up to 5)
`

---

## Quality Assurance

### Subagent Output Validation

**Check for each completed task**:
- [ ] Task marked as completed in tasks.md
- [ ] All files created are syntactically valid
- [ ] Tests pass (if applicable)
- [ ] No console errors or warnings
- [ ] Code follows project conventions
- [ ] All referenced requirements are met

### Documentation Updates

**After successful task completion**:
- [ ] Update ERROR_MAP.md (even if no errors)
- [ ] Note any learnings or patterns discovered
- [ ] Reference similar tasks
- [ ] Update statistics in ERROR_MAP.md

---

## Communication Protocol

### Orchestrator to Subagent
- **Task Details**: Include full task description from tasks.md
- **Context Files**: Attach relevant files for reference
- **Clear Scope**: Define exactly what should be completed
- **Success Criteria**: List all checkpoints

### Subagent to Orchestrator
- **Progress Updates**: Provide status during execution
- **Error Reports**: Include full error details immediately
- **Completion Report**: Summary of what was done
- **File Changes**: List all files created/modified

### Orchestrator to User
- **Status Updates**: Brief progress reports
- **Error Alerts**: When subagent encounters issues
- **Completion Summary**: What was accomplished
- **Next Steps**: What's ready to execute next

---

## Best Practices

### For Orchestrator
✅ Always read ERROR_MAP.md before delegating  
✅ Include full context in subagent prompts  
✅ Monitor for common error patterns  
✅ Document everything in ERROR_MAP.md  
✅ Use task_list frequently to check readiness  
✅ Never execute code directly  

### For Subagents (instructions in prompts)
✅ Check error map before starting  
✅ Follow naming conventions from project  
✅ Run tests after making changes  
✅ Document errors with full details  
✅ Use established patterns from completed tasks  
✅ Ask for clarification if requirements unclear  

---

## Common Subagent Task Types

### 1. Create New MFE Repository
**Subagent handles**:
- Initialize git repo
- Create Angular app with CLI
- Install dependencies
- Configure Module Federation
- Set up package.json scripts

### 2. Migrate Tests
**Subagent handles**:
- Locate original tests
- Adapt imports for new location
- Set up test infrastructure (mocks, providers)
- Run tests and verify coverage

### 3. Extract & Move Components
**Subagent handles**:
- Copy component files
- Update import paths
- Update barrel exports
- Run tests to verify

### 4. Configure Build Scripts
**Subagent handles**:
- Update package.json scripts
- Create webpack configs
- Test build process
- Verify output

---

## Troubleshooting

### Subagent Seems Stuck
- Check if waiting for user input in prompt
- Review if task is dependent on prerequisite
- Check ERROR_MAP.md for similar blocked issues

### Repeated Errors
- Review ERROR_MAP.md for pattern
- Try alternative approach documented there
- Consider if task prerequisites are missing

### Incomplete Output
- Verify task description was clear
- Check if subagent requested clarification
- Review error map for similar incomplete tasks

---
