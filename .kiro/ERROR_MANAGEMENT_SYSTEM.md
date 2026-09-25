# ?? ERROR MANAGEMENT SYSTEM - Complete Documentation Index

**System Overview**: Como o orchestrator deve rastrear, documentar e aprender com erros para não repeti-los.

---

## ?? O Sistema em Poucas Palavras

`
Task 1 Error ? Document in ERROR_MAP.md
        ?
Task 2 ? Check ERROR_MAP.md ? Use known solution ? Avoid error
        ?
Task 3 ? Check ERROR_MAP.md ? Prevent issue before starts
`

---

## ?? Documentação do Sistema (Guia de Leitura)

### 1?? COMEÇAR AQUI (Este arquivo)
**Arquivo**: .kiro/ERROR_MANAGEMENT_SYSTEM.md
**Tempo**: 2 minutos
**Objetivo**: Entender o sistema completo em visão geral
**Leia**: Este documento inteiro

---

### 2?? ARQUIVO PRINCIPAL: ERROR_MAP.md
**Arquivo**: .kiro/ERROR_MAP.md
**Tempo**: 5 minutos (primeira leitura), depois consulta rápida
**Objetivo**: Repositório central de todos os erros documentados
**Quando usar**:
- ? ANTES de cada tarefa: Procure por erros similares
- ? DURANTE execução: Monitore para erros conhecidos
- ? DEPOIS de tarefa: Adicione novo erro se não existe

**Estrutura**:
`
ERROR_MAP.md
+-- How to Use (instruções de uso)
+-- Index of Tasks (tabela de tarefas com erros)
+-- ERROR ENTRIES (documentação detalhada de cada erro)
+-- Common Patterns & Solutions (padrões recorrentes)
+-- Statistics (números: total, por tipo, por categoria)
`

---

### 3?? GUIA DE MAPEAMENTO: ERROR_MAPPING_GUIDE.md
**Arquivo**: .kiro/ERROR_MAPPING_GUIDE.md
**Tempo**: 10 minutos (ler completo uma vez)
**Objetivo**: Instruções DETALHADAS para documentar erros
**Quando usar**: Quando você precisa ADICIONAR um novo erro a ERROR_MAP.md
**Contém**:
- ? QUANDO documentar erros
- ? Template rápido para nova entry
- ? Processo completo em 6 steps
- ? 5 categorias de erro com exemplos
- ? Checklist de verificação
- ? Como linkar erros relacionados

**Exemplo de uso**:
`
Tarefa falhou ? ERROR_MAPPING_GUIDE.md Step 1-6 ? Erro documentado
`

---

### 4?? WORKFLOW PÓS-TAREFA: POST_TASK_ERROR_WORKFLOW.md
**Arquivo**: .kiro/POST_TASK_ERROR_WORKFLOW.md
**Tempo**: 15 minutos (ler completo), depois 2 min por tarefa
**Objetivo**: Checklist completo para ações APÓS cada tarefa
**Quando usar**: Após CADA tarefa se completar (sucesso ou fracasso)
**Fluxo em 6 Steps**:
`
A. Coletar Dados da Tarefa
   ?
B. Verificar ERROR_MAP.md
   ?
C. Documentar Erro ou Sucesso
   ?
D. Atualizar Task Status
   ?
E. Executar SKILL-COMMIT (se sucesso)
   ?
F. Reportar ao User
`

**Checklist**: 25 items para verificar após cada tarefa

---

## ?? Workflow Completo

### Cenário 1: PRIMEIRA TAREFA (Error Unknown)

`
Task 1 FAILED
    ?
Read: ERROR_MAPPING_GUIDE.md (como documentar)
Read: POST_TASK_ERROR_WORKFLOW.md Step A-C (workflow)
    ?
Collect error details
Check ERROR_MAP.md (não existe) ? NOVO ERRO
Documentar entry completa com:
  - Error details
  - Root cause analysis
  - Solution (ou status PENDING)
  - Prevention strategy
    ?
Add to ERROR_MAP.md
Update statistics
    ?
Próximas tarefas agora podem prevenir este erro
`

### Cenário 2: TAREFA SIMILAR (Error Known)

`
Task 5 FAILED (same error as Task 1)
    ?
Read: ERROR_MAP.md (procurar erro similar)
    ?
ENCONTROU: Task 1 tem documentação completa com solução
    ?
Apply solution from Task 1
    ?
Documentar em ERROR_MAP.md:
  - Task 5 also had this error
  - Solution from Task 1 still works? ? or ?
  - Update prevention strategy if needed
    ?
Próxima tarefa com erro similar terá 2 referências
`

### Cenário 3: TAREFA SUCEDIDA (No Errors)

`
Task 3 SUCCEEDED
    ?
Read: POST_TASK_ERROR_WORKFLOW.md (workflow)
    ?
Documenta sucesso e pattern em ERROR_MAP.md:
  - What worked
  - Commands used
  - Pattern for future tasks
    ?
Execute SKILL-COMMIT
    ?
Próximas tarefas similares podem reutilizar pattern
`

---

## ?? As 5 Categorias de Erro

### 1. COMMAND ERRORS
**Quando**: Executar npm commands, shell commands
**Exemplo**: \
pm ERR! Missing script: 'build:ssr'\
**Prevenir**: Verificar package.json antes
**Como documentar**: Veja ERROR_MAPPING_GUIDE.md - Command Errors

### 2. CODE ERRORS
**Quando**: Import paths wrong, syntax errors, missing exports
**Exemplo**: \Cannot find module '@/admin/pages'\
**Prevenir**: Check tsconfig paths, verify barrel files
**Como documentar**: Veja ERROR_MAPPING_GUIDE.md - Code Errors

### 3. TEST ERRORS
**Quando**: Jest/Vitest test failures, timeouts, mock issues
**Exemplo**: \Error: Test timed out in 5000ms\
**Prevenir**: Mock external calls, use reasonable timeouts
**Como documentar**: Veja ERROR_MAPPING_GUIDE.md - Test Errors

### 4. BUILD ERRORS
**Quando**: Webpack, Angular build failures
**Exemplo**: \Module Federation shared dependency version mismatch\
**Prevenir**: Verify webpack.config.js, align versions
**Como documentar**: Veja ERROR_MAPPING_GUIDE.md - Build Errors

### 5. DEPENDENCY ERRORS
**Quando**: npm install, version conflicts
**Exemplo**: \@angular/core@21 requires typescript@5.2 but you have @5.1\
**Prevenir**: Run npm install, verify all versions match
**Como documentar**: Veja ERROR_MAPPING_GUIDE.md - Dependency Errors

---

## ? CHECKLIST: After Every Task Execution

**Use este checklist CURTO após cada tarefa:**

`
After task completes:

1. COLLECT DATA (ERROR_MAPPING_GUIDE.md Step A)
   - [ ] Task ID
   - [ ] Success or Failure?
   - [ ] If error: Full error message
   - [ ] If error: Command that failed
   - [ ] If error: File/Line reference

2. CHECK ERROR_MAP.md (ERROR_MAPPING_GUIDE.md Step B)
   - [ ] Search for similar error
   - [ ] Found? Use that solution
   - [ ] Not found? Prepare to document new error

3. DOCUMENT (ERROR_MAPPING_GUIDE.md Steps C)
   - [ ] Add entry to ERROR_MAP.md
   - [ ] Use template from guide
   - [ ] Include prevention strategy
   - [ ] Update statistics

4. UPDATE STATUS (POST_TASK_ERROR_WORKFLOW.md Step D)
   - [ ] Call task_update(status='completed' or 'failed')

5. SKILL-COMMIT (POST_TASK_ERROR_WORKFLOW.md Step E)
   - [ ] If SUCCESS: disclose_context + invoke_sub_agent
   - [ ] If FAILURE: Skip, report to user

6. REPORT (POST_TASK_ERROR_WORKFLOW.md Step F)
   - [ ] Inform user of result
   - [ ] Mention ERROR_MAP.md entry
`

---

## ?? Key Rules

**MUST DO**:
? Document EVERY task execution in ERROR_MAP.md
? Check ERROR_MAP.md BEFORE starting similar task
? Include prevention strategy in EVERY error entry
? Update statistics after adding error
? Link related errors across tasks
? Use consistent template format

**NEVER DO**:
? Skip documenting "minor" errors
? Document error without root cause analysis
? Add entry without prevention strategy
? Commit changes without running tests/builds first
? Continue to next task with known error unresolved

---

## ?? How ERROR_MAP.md Grows

**Week 1**:
`
Tasks 1-5 execute
Some errors, some successes
ERROR_MAP.md: 5 entries
Statistics: Various errors logged
`

**Week 2**:
`
Tasks 6-10 execute
Check ERROR_MAP.md BEFORE each task
Prevent 80% of potential errors
ERROR_MAP.md: 8 entries (only new errors added)
Statistics: Fewer new errors, more prevented
`

**Week 3+**:
`
Tasks 11+ execute
Most errors are PREVENTED (found in ERROR_MAP.md)
ERROR_MAP.md becomes reference guide
Statistics show: Mostly "Task succeeded, used pattern from X"
Success rate increases significantly
`

---

## ?? Relationship Between Documents

`
.kiro/
+-- ERROR_MAP.md (CENTRAL REPO - Todos os erros)
¦   +-- Read by: ERROR_MAPPING_GUIDE.md
¦   +-- Updated by: POST_TASK_ERROR_WORKFLOW.md
¦   +-- Consulted by: Every orchestrator before task
¦
+-- ERROR_MAPPING_GUIDE.md (HOW TO DOCUMENT)
¦   +-- Used by: Orchestrator adding new error
¦   +-- References: ERROR_MAP.md template section
¦   +-- Output: New entry in ERROR_MAP.md
¦
+-- POST_TASK_ERROR_WORKFLOW.md (COMPLETE WORKFLOW)
¦   +-- Used by: Orchestrator after every task
¦   +-- Calls: ERROR_MAPPING_GUIDE.md for Step C
¦   +-- Calls: AFTER_TASK_COMPLETION.md for Steps D-F
¦   +-- Updates: ERROR_MAP.md during execution
¦
+-- AFTER_TASK_COMPLETION.md (QUICK 4-STEPS)
¦   +-- Used by: Orchestrator for steps after ERROR mapping
¦   +-- References: ORCHESTRATOR_SKILL_INVOKE.md
¦
+-- ORCHESTRATOR_SKILL_INVOKE.md (SKILL EXECUTION)
    +-- Used by: Orchestrator for SKILL-COMMIT step
`

---

## ?? Reading Order (First Time Setup)

**If you're new to this system:**

1. Read THIS file (ERROR_MANAGEMENT_SYSTEM.md) - 2 min
2. Read: ERROR_MAPPING_GUIDE.md - 10 min
3. Read: POST_TASK_ERROR_WORKFLOW.md - 15 min
4. Skim: ERROR_MAP.md to see examples - 5 min
5. Ready to execute tasks! ?

**Total time**: ~30 minutes, then you know the whole system

---

## ?? Next Task Execution

**For NEXT task that completes:**

1. **Open**: ERROR_MAP.md
2. **Search**: For similar errors (by task name, command, or error type)
3. **If found**: Note the prevention strategy
4. **If not found**: Prepare to document new entry
5. **Execute task**
6. **Use**: ERROR_MAPPING_GUIDE.md to document
7. **Use**: POST_TASK_ERROR_WORKFLOW.md for complete workflow
8. **Update**: ERROR_MAP.md with results
9. **Progress**: Next task benefits from THIS task's documentation

---

## ?? Why This System Works

**Problem**: Without ERROR_MAP.md
- ? Same errors occur multiple times
- ? Developer keeps debugging same issue
- ? No pattern recognition
- ? No accumulated learning
- ? Frustration and wasted time

**Solution**: With ERROR_MAP.md
- ? Errors documented once
- ? Prevention strategies reused
- ? Patterns recognized early
- ? Accumulated knowledge grows
- ? Efficiency improves exponentially

**Example**:
`
Task 1: Error X takes 1 hour to debug and fix ? Document
Task 2: Same error X found in ERROR_MAP ? Apply solution in 5 min
Task 3: Similar error Y found in ERROR_MAP ? Prevented entirely
Task 4-10: Fewer new errors, more prevented
`

---

## ?? Questions?

**"When should I document?"**
? After EVERY task execution, success or failure

**"What if I don't know the root cause?"**
? Document "Root Cause: UNKNOWN" and status "PENDING INVESTIGATION"
? Come back later when you find root cause

**"What if error already exists in ERROR_MAP?"**
? Add current task ID to "Tasks Affected" section
? Note if solution still works or needs update

**"Do I need to document successful tasks?"**
? YES! Document what worked so pattern can be reused

**"How detailed should documentation be?"**
? Detailed enough that someone else can understand and apply it
? Include: What, Why, How, and How to Prevent

---

**Version**: 1.0  
**Last Updated**: 2026-09-25  
**Status**: Ready for Implementation  
**Audience**: Orchestrator (all task executions)

