#!/usr/bin/env node

/**
 * Sync script for articles registry
 *
 * Scans frontend/app for article directories and ensures they're in articles.json.
 * Articles not in the JSON will be added with status: "incomplete".
 * Articles already in JSON (even with status: "incomplete") won't be overwritten.
 *
 * Usage: node scripts/sync-articles.js
 */

const fs = require('fs');
const path = require('path');

const FRONTEND_APP_DIR = path.join(__dirname, '..', 'frontend', 'app');
const ARTICLES_JSON_PATH = path.join(__dirname, '..', 'frontend', 'data', 'articles.json');

// Directories to exclude (not articles)
const EXCLUDED_DIRS = new Set([
  'api',
  'fonts',
  '_components',
  '_lib',
  '_utils',
]);

function getArticleSlugs() {
  const entries = fs.readdirSync(FRONTEND_APP_DIR, { withFileTypes: true });
  const slugs = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (EXCLUDED_DIRS.has(entry.name)) continue;
    if (entry.name.startsWith('_')) continue;
    if (entry.name.startsWith('.')) continue;

    // Check if directory has a page.tsx file
    const pagePath = path.join(FRONTEND_APP_DIR, entry.name, 'page.tsx');
    if (fs.existsSync(pagePath)) {
      slugs.push(entry.name);
    }
  }

  return slugs;
}

function loadArticlesJson() {
  if (!fs.existsSync(ARTICLES_JSON_PATH)) {
    return { articles: [] };
  }
  const content = fs.readFileSync(ARTICLES_JSON_PATH, 'utf-8');
  return JSON.parse(content);
}

function saveArticlesJson(data) {
  const content = JSON.stringify(data, null, 2) + '\n';
  fs.writeFileSync(ARTICLES_JSON_PATH, content);
}

function slugToTitle(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function main() {
  console.log('Scanning for articles...\n');

  const slugsInRepo = getArticleSlugs();
  const articlesData = loadArticlesJson();
  const slugsInJson = new Set(articlesData.articles.map(a => a.slug));

  const newSlugs = slugsInRepo.filter(slug => !slugsInJson.has(slug));
  const missingSlugs = [...slugsInJson].filter(slug => !slugsInRepo.includes(slug));

  console.log(`Found ${slugsInRepo.length} article(s) in repo:`);
  slugsInRepo.forEach(slug => {
    const inJson = slugsInJson.has(slug);
    const status = inJson ? articlesData.articles.find(a => a.slug === slug)?.status : 'not in json';
    console.log(`  - ${slug} [${status}]`);
  });

  if (newSlugs.length > 0) {
    console.log(`\nAdding ${newSlugs.length} new article(s) to JSON:`);
    for (const slug of newSlugs) {
      const newArticle = {
        slug,
        title: slugToTitle(slug),
        description: 'Description pending',
        icon: '?',
        status: 'incomplete',
      };
      articlesData.articles.push(newArticle);
      console.log(`  + ${slug} (status: incomplete)`);
    }
    saveArticlesJson(articlesData);
    console.log('\nUpdated articles.json');
  } else {
    console.log('\nNo new articles to add.');
  }

  if (missingSlugs.length > 0) {
    console.log(`\nWarning: ${missingSlugs.length} article(s) in JSON but not in repo:`);
    missingSlugs.forEach(slug => {
      console.log(`  ! ${slug}`);
    });
  }

  console.log('\nDone.');
}

main();
