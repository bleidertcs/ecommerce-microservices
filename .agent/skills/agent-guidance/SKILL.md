---
name: agent-guidance
description: Core guidelines for AI agents working in this project, explaining how to use rules, skills, and tools.
---

# Agent Guidance Skill

This skill provides fundamental instructions for all AI agents operating within this e-commerce microservices repository. 

## General Approach

1. **Understand the Architecture**: Always review `MASTER_GUIDE.md` and `.cursor/skills/project-architecture/SKILL.md` before starting major tasks. This project uses NestJS for microservices, Next.js for the frontend, Kong as API Gateway, Casdoor for Identity/SSO, and Prisma as the ORM.
2. **Apply Local Rules**: Check the `.cursor/rules/*.mdc` files based on the directory you are modifying. `AGENTS.md` provides a mapping of which rule applies to which glob.
3. **Check Capabilities**: Use your available skills (`.agent/skills/`) to guide implementation details (like `testing-quality`, `prisma-ops`, `nestjs-microservices`).

## Use of Specialized Tools

### 1. Sequential Thinking (`@mcp:sequential-thinking`)
When faced with complex debugging, architectural mapping, or multi-step logic creation, leverage the `sequentialthinking` tool. 
- Break down the problem.
- Formulate a hypothesis.
- Verify progressively.
- Use it to plan out changes across multiple microservices to prevent breaking the overall ecosystem.

### 2. External Context Search (`@mcp:context7`)
When implementing integrations with external libraries, or if you need the most up-to-date syntax for libraries like `@nestjs/microservices`, `Prisma`, `Stripe`, etc., you should use the `context7` MCP server:
- Example: "How to set up RMQ Transporter in NestJS v10" -> query via `context7`.
- This ensures that code generated uses the latest and most secure APIs.

## Coding Mindset
- **No approximations**: Read the existing codebase structure instead of guessing.
- **Microservices Isolation**: Do not share database access directly between microservices; always communicate via gRPC or message queues.
- **Traceability**: Mention `SigNoz` and `OpenTelemetry` when modifying bootstrapping or tracing setups.
- **UI/UX**: Produce beautiful, responsive frontend code according to `ui-ux.mdc`.
