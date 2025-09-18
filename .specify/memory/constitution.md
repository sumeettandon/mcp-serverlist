```markdown
# MCP Serverlist Constitution
<!-- Purpose: Define the project's irrevocable engineering, build, and release principles. -->

## Mission Statement

All UI and delivery components must produce static HTML, CSS, and JavaScript assets at build time. No server-side rendering, runtime templating, or dynamic backends are permitted for the public-facing website. Build-time data processing (static generation) is allowed and encouraged. The site must be deployable to CDNs and static hosts with predictable caching and immutable build artifacts.

## Core Principles

1. Static-First (NON-NEGOTIABLE)
	- All publicly served pages and UI components must be rendered into static HTML/CSS/JS during the build step.
	- Any data required by a page must be fetched at build time, embedded as serialized data, or requested from client-side code with clear fallbacks.
	- No server-side rendering (SSR) or application servers for page rendering in production.

2. Performance & Cost Efficiency
	- Prioritize fast initial load on 3G-class and low-end devices.
	- Enforce performance budgets (e.g., JS bundle <= 150KB gzipped for initial payload; Time to interactive on mid-range mobile < 5s under throttled network — exact budgets defined in CI). These budgets are conservative defaults and may be adjusted with team approval.
	- Lazy-load non-critical assets, defer non-essential scripts, and use resource hints (`preload`, `prefetch`) appropriately.

3. Accessibility & Inclusive Design (A11y)
	- Meet WCAG 2.1 AA as a baseline for all public pages.
	- Use semantic HTML, proper ARIA roles only when necessary, keyboard focus management, and touch-friendly sizes (minimum tappable target: 44x44 CSS px as guidance).
	- Automated accessibility checks integrated into CI (axe-core or similar); manual audits for complex components.

4. Minimal Dependencies & Justified Tooling
	- Prefer vanilla JavaScript and CSS for components. Add a dependency only when it provides clear, measurable value (performance, security, developer productivity) and cannot be implemented safely within the team’s capacity.
	- Every dependency addition must include: purpose, impact on bundle size, security considerations, and rollback plan; approval documented in PR description.
	- Regular audits: run dependency safety and usage audits quarterly; remove unused or abandoned packages immediately.

5. Design System & Component-Based Development
	- Components are single-responsibility, framework-agnostic where possible, and export static markup + styles + optional lightweight JS for progressive enhancement.
	- Maintain a centralized design tokens file (colors, spacing, type scale) and a component library that builds to static artifacts consumable by the site.

6. Deterministic, Observable Builds
	- Builds must be deterministic and produce verifiable, immutable artifacts (content-hashed filenames).
	- All build configuration, scripts, and environment-specific settings must be stored in version control and follow the approved config schema.

7. Release Policy & Versioning
	- Use semantic versioning (MAJOR.MINOR.PATCH) for public releases.
	- Every release must include a changelog, performance snapshot, and deploy manifest (list of files and hashes).

## Build & Deployment Requirements

- Static output only: build pipelines must emit only files (HTML, CSS, JS, images, fonts, JSON) suitable for static hosts or CDNs.
- Environment-specific builds: `dev`, `staging`, and `prod` configurations supported at build time via environment variables or build flags. No runtime server-side config injection in production.
- CDN optimization: produce cache-friendly, immutable assets (e.g., `app.abcdef.js`), and recommend `Cache-Control: public, max-age=31536000, immutable` for fingerprinted assets; HTML pages should use conservative caching with validation (short max-age, `stale-while-revalidate` suggestions optional).
- Headers & security: recommend serving with `Strict-Transport-Security`, appropriate `Content-Security-Policy`, `Referrer-Policy`, and `X-Content-Type-Options`. CI should provide guidance and validation for header sets per target environment.
- Build-time data: accept JSON/YAML/Markdown as build inputs. Any dynamic or frequently changing data must either be fetched and baked into scheduled builds or delivered as small, cacheable JSON fetched client-side with progressive enhancement.

## Performance Practices

- Image optimization: prefer modern formats (AVIF/WebP) with fallbacks; generate responsive `srcset` and use `loading="lazy"` for below-the-fold images.
- Font optimization: choose a minimal set of font weights; use `font-display: swap`; subset fonts for critical languages where possible.
- Bundling: keep initial JS minimal. Use modern bundlers/build tools that allow tree-shaking and code-splitting. Evaluate bundle impact for each addition.
- CI performance checks: run Lighthouse or similar audits during CI for `staging`/`prod` builds and fail builds that violate critical budgets.

## Accessibility & UX

- Touch-friendly defaults: minimum interactive target sizes, adequate spacing, and responsive hit areas.
- Focus states: visible, high-contrast focus indicators for keyboard users.
- Reduced-motion preferences: respect `prefers-reduced-motion` and provide non-animating fallbacks.

## Dependency & Security Policy

- Justification required: PRs that add or update dependencies must include a short justification, impact on bundle size, and link to the upstream project and license.
- Security checks: run dependency vulnerability scanners in CI (e.g., `npm audit`, `snyk`). High/critical vulnerabilities must be resolved before merging.
- Quarterly pruning: run unused-dependency scans and remove any packages with no active usage.

## Development Workflow & Quality Gates

- Code review mandatory: all changes must be reviewed by at least one other developer and pass CI checks (lint, tests, performance, accessibility, dependency checks).
- Local preview: developer experience must include a fast static server for local testing with mocked build-time data.
- Tests: unit tests for component logic, visual regression tests for important pages/components, and E2E where appropriate. Testing must be automated in CI.

## Design System & Component Library

- Canonical tokens: colors, typography, spacing, and breakpoints must be defined in a single source of truth (JSON/SCSS/CSS variables).
- Components export static markup and styles; interactive behavior is small, opt-in JS that enhances accessibility.

## CI/CD & Automation (Guiding Requirements)

- Builds must run in CI, produce artifacts, and upload them to an artifact store and/or deploy to staging CDN automatically.
- Deployments: automated promotion from `staging` to `prod` only after passing performance and accessibility gates and manual approval.
- Rollbacks: must be possible by promoting a previous artifact or invalidating the CDN cache to the previous build.

## Monitoring & Performance Testing

- Performance testing: schedule periodic synthetic tests (Lighthouse) and collect metrics on real user performance when available.
- Alerts: failing performance or accessibility budgets in `prod` triggers a team notification and a hotfix workflow.

## Governance & Amendments

- Supremacy: this Constitution supersedes other project practices where it applies. Exceptions are allowed only with documented migration plans and explicit team approval.
- Amendments: changes to the Constitution require a proposal PR, two approvers, and a migration plan for affected systems.

## Enforcement & Compliance

- CI gates: PRs that modify public-facing pages/components must pass automated checks for accessibility, performance budgets, linting, and dependency safety.
- Manual review: product/UX or security reviewers may request additional audits where appropriate.

## Release & Versioning

- Semantic versioning required for releases. Tag releases in Git and publish release notes including performance snapshots and list of modified artifacts.

## Appendix: Tooling Guidance (non-normative)

- Recommended minimal toolset (examples only) — additions require justification:
  - Bundler: `esbuild` or `rollup` for small, fast build outputs. Chosen for speed and small overhead.
  - CSS: modern CSS with PostCSS only if autoprefixing or small transforms are necessary. Avoid heavy CSS-in-JS unless justified.
  - Accessibility testing: `axe-core` integration in CI.
  - Performance testing: Lighthouse CI for scheduled audits.

- Dependency notes: small, build-time tools are preferred. Avoid runtime frameworks that increase initial download unless necessary and approved.

**Version**: 1.0.0 | **Ratified**: 2025-09-18 | **Last Amended**: 2025-09-18
```