# Portfolio v2

Personal portfolio website showcasing my projects, interests, and experience in tech.

Built with **React, TypeScript, and CSS**

## Tech Stack

- React
- TypeScript
- Vite
- CSS
- Cloudflare Pages

**Live:** https://rfeng.me

## Project write-ups

Run `npm run dev` and visit `/projects/project-template` on the local URL Vite prints.

Edit `src/projects.ts` to replace the template title, summary, tags, and section
paragraphs with your own writing. Add or remove sections and paragraphs as needed.
To create another page, copy a project object in the array and give it a unique
URL-friendly `slug`, such as `homelab`. Its page will be `/projects/homelab`.

Each entry automatically appears in the homepage Projects carousel with its
title, summary, and tags, and links to its write-up. Small collections repeat
visually to fill the continuous carousel.
`public/_redirects` lets Cloudflare Pages serve project URLs directly and on refresh.
