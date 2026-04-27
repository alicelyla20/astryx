<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## TypeScript Integrity
- **NO Implicit 'any'**: Never leave parameters without explicit types in map, filter, or function definitions. Always annotate or use interfaces.
- **Data Integrity**: Ensure state variables used for selection or filtering are typed to include all required related properties (e.g., categories must include chains if they are accessed).

## Deployment & Verification
- **Build Verification**: Every time the user requests a `commit` and `push`, you **MUST** run `npm run build` first. If the build fails, fix the errors before proceeding with the commit. Never push code that breaks the production build.
<!-- END:nextjs-agent-rules -->
