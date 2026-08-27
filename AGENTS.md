<!-- # Agent Rules & Coding Standards

## 1. Project Stack & Constraints

- **Language & Runtime**: TypeScript v5, Node.js v22
- **Primary Frameworks**: Next.js v16 (App Router), React v19, TailwindCSS v4
- **Linter & Formatter**: ESLint v9 and Prettier v3 are strictly enforced. All code must conform to existing configurations.
- **Dependency & Configuration Auditing**: You MUST read, analyze, and strictly adhere to the following root configuration files at the start of the session:
  - `package.json` (Verify active runtime versions, scripts, and available dependencies)
  - `tsconfig.json` (Enforce strict compiler options, module resolution, and path aliases)
  - `eslint.config.json` / `eslint.config.js` (Apply precise rules, plugin constraints, and global variables)
  - `postcss.config.js` / `postcss.config.json` (Adhere to CSS processing and Tailwind pipelines)
  - `.gitignore` (Never read, modify, or create files listed in gitignore)
- **Dependency Enforcement**: Do NOT introduce new packages or external dependencies without explicit human approval.

---

## 2. Documentation Resources

For version-specific implementations, proactively consult and cite these reference materials. Do not rely on historical pre-trained knowledge for major API signatures. You are explicitly authorized and expected to crawl any sub-paths under these links:

- **Core Architecture**:
  - React v19: https://react.dev/reference/react/
  - Next.js v16: https://nextjs.org/docs/
  - Tailwind CSS v4: https://tailwindcss.com/docs/
- **State Management**:
  - Redux Toolkit:
    - Core Intro: https://redux-toolkit.js.org/introduction/
    - Tutorials: https://redux-toolkit.js.org/tutorials/
    - Usage Guides: https://redux-toolkit.js.org/usage/
    - API Reference: https://redux-toolkit.js.org/api/
    - RTK Query: https://redux-toolkit.js.org/rtk-query/
  - SWR Data Fetching: https://swr.vercel.app/docs/
- **Animation & UI components**:
  - GSAP & GSAP React:
    - Core Docs: https://gsap.com/docs/v3/
    - Resources: https://gsap.com/resources/
  - Plaiceholder Image Optimization: https://plaiceholder.co/docs/

Always cite the exact URL or documentation subsection when explaining concepts or introducing new integration syntax.

## 3. Environment & CLI Commands

- **Test Command**: `npm test`
- **Build Command**: `npm run build`
- **Lint/Format Command**: `npm run lint` or `npx eslint --fix && npx prettier --write .`

---

## 4. Agent Lifecycle Workflow

### Phase 1: Context Gathering & Configuration Mapping

- **Prompt Analysis**: Thoroughly analyze the user prompt to identify core requirements, architectural boundaries, and user intent.
- **Shallow Configuration Parsing**: Scan `tsconfig.json` paths to map import aliases and read `eslint.config.json` to ensure code styles do not conflict with linter rules. Extract only specific config values relevant to the task rather than reading the entire file text.
- **Targeted Codebase Indexing**: Do not read full directories. Search the codebase using precise keywords, file names, or specific grep patterns. Focus exclusively on locating exact files related to the task, shared utilities, core types, or matching architectural patterns.
- **Import & Dependency Documentation Mapping**: Trace and scan the specific import paths of the target files. Cross-reference them with the ecosystem links in **Section 2 (Documentation Resources)**. If the feature touches complex APIs (e.g., React 19 Server Actions, Next.js 16 caching, Tailwind v4 compiler layers), you MUST read the linked live docs before generating code.
- **Token Budgeting**: Limit codebase indexing search results to file names, folder structures, and high-level signatures (e.g., function names, exported types) first. Only request deep file content when a file is confirmed as an active dependency.

### Phase 2: Planning & Guardrails

- **Technical Blueprint**: Propose a step-by-step implementation plan in plain text. Specify which files will be read, created, or modified.
- **Task Splitting**: If a proposed change impacts >5 files, STOP and propose splitting the task into sub-tasks.

### Phase 3: Read, Edit, and Apply

- **Targeted Context Reading**: Avoid reading massive files in full. Read only the relevant code blocks, type definitions, and interface signatures of the active working file and its direct dependencies to conserve context tokens.
- **Strict Import Validation**: Never guess or invent an import path. Check the exact file location or export statement before adding imports.
- **Precise Editing**: Modify or generate code adhering strictly to the repository's patterns, ensuring functional programming paradigms, strict typing, and explicit error handling.
- **Path Resolution**: Use absolute path aliases defined in `tsconfig.json` (e.g., `@/*`) instead of relative paths for imports when applicable.
- **Memory Guardrail**: If a dependency file is too large to read safely within your current context limits, do not guess its contents. Stop and request the user to provide the specific snippet or interface.

### Phase 4: Output Management & Auto-Resumption

- **Chunked Code Generation**: Despite having a large `128k` context input window, your hardware/provider generation limit restricts maximum output tokens per turn. If a single file or refactor is long, do NOT attempt to write it all at once. Write structural boilerplate or high-priority hooks/sub-components first.
- **Graceful Multi-turn Termination**: If you are nearing your response limit or find yourself forced to cut off mid-sentence, append a summary of completed sub-components/lines and explicitly outline what remains.
- **Proactive Continuation Command**: When output limits compel a stoppage, provide the user with an exact copy-pasteable instruction to resume the generation process seamlessly (e.g., _"Prompt me with 'Continue Phase 3 from function X' to proceed"_).

### Phase 5: Validation & Error Analysis

- **Syntactic Validation**: Run ESLint and Prettier commands immediately after editing to catch formatting and linting errors.
- **Build & Test Validation**: Execute the project build and test commands to verify that changes have not broken existing functionality.
- **Error Resolution Loop**: Analyze compiler, linting, or test errors. If an error is detected, iterate on a fix.
- **Circuit Breaker**: If three consecutive fix attempts fail, STOP. Revert the changes, summarize the failures, and ask for human guidance.

---

## 5. Architecture & Code Style

- **Structure**: Application code lives in `src/`, unit tests live in `tests/`.
- **Convention**: Functional components, clean code separation, strict typing, and defensive error handling.
- **Styling Rules**: Follow CSS patterns dictated by `@tailwindcss/postcss` and Tailwind v4 parameters. Do not introduce custom vanilla CSS or legacy `.css` files if utility configurations are available.
- **Anti-Hallucination Guardrails**:
  - **No Assumption Policy**: If a variable, type, or function definition cannot be found in the indexed context files, do not assume it exists. Ask the user for clarification.
  - **Verified API Integration**: Never guess the methods, parameters, or return types of external dependencies. Because the repository utilizes modern paradigms (e.g., React 19 `use` hook, Next.js 16 dynamic routing properties), prioritize matching official live documentation patterns over generalized pre-trained local historical models.
- **Chunked File Generation**: If a single file or task requires massive code output, do NOT attempt to write it all at once. Write structural boilerplate or high-priority modules first.
- **Graceful Termination**: If you are close to hitting your maximum output token limit or your response cuts off midway, append a summary of completed files and explicitly outline the missing work.
- **Resume Command**: When output limits cause a stoppage, provide the user with an exact, copy-pasteable instruction to resume the generation process seamlessly (e.g., _"Prompt me with 'Continue Phase 3 from line X' to proceed"_).

---

## 6. Definition of Done

- Code is verified error-free via TypeScript compiler (if applicable), ESLint, and Prettier.
- All unit tests pass successfully.
- No `.gitignore` entries are exposed, created, or leaked into the workspace. -->
