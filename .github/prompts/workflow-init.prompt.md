## ⚙️ Copilot Workflow Init Prompt

### 🎯 Objective
Briefly initialize Copilot for this repository, assuming all workflow capabilities (Task tracking, documentation sync, ADR governance, and quality gates) are enabled by default. No capability config file is required.

---

### 🔍 Pre-Flight Discovery (Read-Only)
1. Search for existing candidate files / folders:
```
**/{.ai/tasks.index.json,.ai/doc-index.md,documentation/index.md,docs/index.md}
```
2. Inventory findings (paths, missing artifacts) in a temporary MENTAL summary.


### Repository Analysis

You **MUST FIRST** do a **THOROUGH** analysis of the repository. Use `todos` tool to plan your analysis. Your analysis should include at least the following steps but you can add more as needed:
 - List of all files and **modules** present in the repository. (e.g., use `search` tool or similar to get an overview of the file structure).
 - Identify dependencies use libraries, frameworks, and external services. (e.g., check for package managers like Maven, Gradle, npm, pip, etc).
 - Once frameworks and libraries are identified, research their common usage patterns and best practices. (e.g., if the project uses Spring Boot, understand how Spring Boot applications are typically structured and configured).
 - Identify all public APIs, classes, functions, and their relationships. (e.g., REST endpoints, public methods in classes).
 - Identify key components, services, and their interactions. (e.g., database access layer, business logic layer, presentation layer).
 - Identify build and deployment processes, including CI/CD pipelines if present (helm, docker, kubernetes, etc).
 - Identify most important files such as README.md, package.json, build files, configuration files, and source code directories. Investigate overall project structure and organization and note any patterns or conventions used. (e.g., naming conventions, directory structure).

Then, Analyze this repository and create basic documentations that would help guide an AI assistant.

Those documents are markdown files that are always in `.ai/docs`.

Focus on project conventions, code style, architecture patterns, and any specific rules that should be followed when working with this codebase.

For the initial setup, please only create the following files keep all of the files **UNDER 100 lines** each and keep only information **USEFUL FOR AN LLM** to understand the project:
  - .ai/docs/product.md: Short summary of the product
  - .ai/docs/tech.md: Build system used, tech stack, libraries, frameworks etc. If there are any common commands for building, testing, linting, compiling etc make sure to include a section for that (eslint, maven, gradle, npm, pip, sonarqube, etc)
  - .ai/docs/structure.md: Project organization and folder structure
  
The goal is to be succinct, but capture information that will be useful for an LLM application operating in this project.



### Scaffolding
1. Create missing directories (mkdir -p style) for Task storage, and docs.
2. Create empty scaffold files if absent:
   - Task index (`.ai/tasks.index.json`) with minimal JSON skeleton
   - Changelog file with header (if appropriate)
   - Docs index file with placeholder header if missing
3. Do NOT overwrite existing populated files (append only where applicable).

Emit a Scaffold Report:
```
Scaffold Report:
- tasks.index.json: created | existed | skipped
- changelog.md: created | existed | skipped
- docs index: created | existed | skipped
```

---

### 📤 Final Output
Return ONLY:
1. Discovery Summary
2. Optional Scaffold Report (if scaffolding was requested)
3. Next Steps checklist:
   - Create first Task task
   - Run proposal → approval cycle
   - Add initial sections to docs index
   - Draft first ADR template if useful
4. A short, tutorial-style summary paragraph that explains how this workflow behaves in day-to-day use (from the user’s perspective) based the content of `.github/instructions/workflow.instructions.md`

No extra narrative outside these sections.
