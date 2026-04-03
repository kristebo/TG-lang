import { defineConfig } from 'vite'

// When running in GitHub Actions, GITHUB_REPOSITORY is "owner/repo-name".
// We derive the base path from the repo name so assets resolve correctly
// on a project page (https://owner.github.io/repo-name/).
// Locally (or on a custom domain / user page) we fall back to '/'.
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = repoName ? `/${repoName}/` : '/'

export default defineConfig({ base })
