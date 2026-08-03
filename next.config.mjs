/** @type {import('next').NextConfig} */
/** Static export → deploy obsah složky `out/` na FTP (Wedos). Pro nasazení do podsložky doplňte `basePath: '/nazev'`. */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
}

export default nextConfig
