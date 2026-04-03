/** @type {import('next').NextConfig} */
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: repoName ? `/${repoName}` : '',
  assetPrefix: repoName ? `/${repoName}/` : undefined,
}

export default nextConfig
