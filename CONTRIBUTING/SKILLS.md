# Adding Skills to flins Directory

Thank you for your interest in contributing to the [flins](https://github.com/flinstech/flins) curated skills directory! This guide will walk you through the process of adding a new skill to the directory.

## Overview

The `directory.json` file in the web app contains a curated list of high-quality skills that users can discover and install directly. To maintain quality and consistency, we require all additions to go through a review process.

## Prerequisites

Before submitting, ensure your skill:

1. **Follows the Agent Skills Standard** - Your skill must have a valid `SKILL.md` file with proper frontmatter
2. **Is actively maintained** - The repository should be recent and responsive to issues
3. **Has clear documentation** - Users should understand what the skill does and when to use it
4. **Works as intended** - The skill should be tested with compatible agents
5. **Has a permissive license** - Preferably MIT, Apache-2.0, or similar

## Submission Process

Submit a pull request with your changes to `apps/web/src/directory.json`.

#### Modify `apps/web/src/directory.json`

Add your skill to the array following this format:

```json
{
  "name": "your-skill",
  "source": "https://github.com/username/repo",
  "description": "Brief, clear description of what the skill does and when to use it",
  "author": "username",
  "tags": ["category1", "category2", "category3"]
}
```

**Field Guidelines:**

| Field         | Requirements                                                          |
| ------------- | --------------------------------------------------------------------- |
| `name`        | Lowercase, kebab-case identifier for the skill                        |
| `source`      | Full HTTPS URL to the git repository                                  |
| `description` | 1-2 sentences, start with what it does, include key frameworks/topics |
| `author`      | GitHub username or organization name                                  |
| `tags`        | 1-5 relevant lowercase tags for categorization                        |

## Quality Standards

Skills in the directory should demonstrate:

### Technical Quality

- Valid `SKILL.md` with required frontmatter (`name`, `description`, `tags`)
- Clear usage instructions
- Appropriate scope (not too broad, not too narrow)
- No redundant functionality with existing entries

### Documentation Quality

- Clear, concise descriptions
- Examples of when/how to use the skill
- Links to relevant documentation

### Maintainability

- Active repository with recent commits
- Responsive to issues and PRs
- Clear license information

### Originality

- Prefer official skills from framework/tool authors
- Avoid duplicate functionality (check existing entries first)
- For forks, prefer the upstream/original repository

## Review Criteria

Submissions are evaluated based on:

1. **Relevance** - Does it solve a real problem for AI coding agents?
2. **Quality** - Is the skill well-written and tested?
3. **Uniqueness** - Does it fill a gap not covered by existing skills?
4. **Maintainability** - Is the repository actively maintained?
5. **Documentation** - Can users easily understand and use the skill?

## What We're Looking For

We're particularly interested in skills for:

- Popular frameworks and libraries (React, Vue, Django, Rails, etc.)
- Developer tools (Docker, Kubernetes, CI/CD, etc.)
- Cloud platforms (Vercel, AWS, Cloudflare, etc.)
- Databases and data stores
- Testing frameworks
- API integrations
- Security best practices
- Performance optimization

## What We Typically Decline

- Very narrow or niche use cases
- Duplicate functionality of existing entries
- Poorly documented skills
- Inactive or unmaintained repositories
- Skills without clear use cases
- Proprietary or closed-source skills

## Getting Help

If you have questions:

- Read the [Agent Skills documentation](https://agentskills.io)

## Code of Conduct

Be respectful and constructive in all interactions. We're all working to make the AI agent ecosystem better together!

---

Thank you for contributing to flins! ???
