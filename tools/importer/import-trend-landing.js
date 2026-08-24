/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroIntroParser from './parsers/hero-intro.js';
import cardsArticleParser from './parsers/cards-article.js';
import columnsArticleParser from './parsers/columns-article.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'trend-landing',
  description: 'Landing page with two-image hero, a card grid of trend items, a feature columns section, and a CTA banner',
  urls: [
    'https://wknd-trendsetters.site/fashion-trends-young-adults-casual-sport',
  ],
  blocks: [
    {
      name: 'hero-intro',
      instances: ['#main-content > header.section.secondary-section'],
    },
    {
      name: 'cards-article',
      instances: ['#trends > div.container > div.grid-layout.desktop-4-column'],
    },
    {
      name: 'columns-article',
      instances: ['#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.grid-layout'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero intro',
      selector: '#main-content > header.section.secondary-section',
      style: 'light',
      blocks: ['hero-intro'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Trend alert',
      selector: '#trends',
      style: null,
      blocks: ['cards-article'],
      defaultContent: [
        '#trends > div.container > div.utility-text-align-center > h2.h2-heading',
        '#trends > div.container > div.utility-text-align-center > p.paragraph-lg',
      ],
    },
    {
      id: 'section-3',
      name: 'Feature',
      selector: '#main-content > section.section.secondary-section:nth-of-type(2)',
      style: 'light',
      blocks: ['columns-article'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'CTA banner',
      selector: '#main-content > section.section.accent-section',
      style: 'accent',
      blocks: [],
      defaultContent: ['#main-content > section.section.accent-section > div.container'],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-intro': heroIntroParser,
  'cards-article': cardsArticleParser,
  'columns-article': columnsArticleParser,
};

// TRANSFORMER REGISTRY - cleanup runs first; section transformer runs after (adds <hr> + metadata)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

/**
 * Normalize card grids whose items are block-wrapping <a> elements
 * (<a class="trend-card"><div>…</div></a>). html2md's ingest collapses
 * consecutive block-level anchors, dropping all but the first card, and it does
 * so BEFORE the beforeTransform hook runs. onLoad runs on the live Playwright
 * DOM before html2md, so rewriting the anchors here preserves every card.
 * Each anchor becomes a <div> (keeping its classes); the card heading is wrapped
 * in a real inline <a> so the link survives.
 */
function normalizeCardAnchors(document) {
  document.querySelectorAll('a.trend-card, a.article-card').forEach((card) => {
    const href = card.getAttribute('href');
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
    if (href && heading && !heading.querySelector('a')) {
      const link = document.createElement('a');
      link.href = href;
      link.append(...heading.childNodes);
      heading.append(link);
    }
    const div = document.createElement('div');
    div.className = card.className;
    div.append(...card.childNodes);
    card.replaceWith(div);
  });
}

// EXPORT DEFAULT CONFIGURATION
export default {
  onLoad: ({ document }) => {
    normalizeCardAnchors(document);
  },
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root/homepage URL to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
