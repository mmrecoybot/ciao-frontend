// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dummyjson.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "d61s2hjse0ytn.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "photo.teamrabbil.com",
      },
      {
        protocol: "https",
        hostname: "securepay.sslcommerz.com",
      },
      {
        protocol: "https",
        hostname: "adminapi.applegadgetsbd.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },
};

module.exports = nextConfig;
