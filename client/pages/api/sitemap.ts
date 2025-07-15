// pages/api/sitemap.ts

import { NextApiRequest, NextApiResponse } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_DOMAIN_URL; // replace with your actual domain
const SERVER_URL = process.env.NEXT_PUBLIC_APP_SERVER_URL; // replace with your actual domain

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const resp = await fetch(`${SERVER_URL}/api/get-seoSitemap`);
    if (!resp.ok) throw new Error("Failed to fetch SEO data");
  
    const data = await resp.json();
  
    const allUrls = [
      { loc: `${BASE_URL}/`, lastmod: new Date().toISOString() },
      ...data.page.map((page: any) => ({
        loc: `${BASE_URL}/p/${page.category}/${page.slug}`,
        lastmod: new Date().toISOString(),
      })),
      ...data.blog.map((blog: any) => ({
        loc: `${BASE_URL}/blog/${blog.slug}`,
        lastmod: new Date().toISOString(),
      })),
    ];
  
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      (url) => `<url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
  </url>`
    )
    .join("\n")}
  </urlset>`;
  
    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(sitemap);
  } catch (error) {
    console.error("Sitemap error:", error);
    res.status(500).send("Sitemap generation failed");
  }  
}
