/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Approved authority pages (roof-insurance, roof-health-score, learning-center, faq)
  // are served as static files from /public for now and will be migrated to App Router
  // pages using the /content data system. See docs/ARCHITECTURE.md.
};
module.exports = nextConfig;
