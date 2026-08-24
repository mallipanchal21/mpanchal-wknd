/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-intro.
 * Base block: hero.
 * Source: https://wknd-trendsetters.site/ (top intro hero)
 * Generated: 2026-08-24
 *
 * Library structure: 1 column, up to 3 rows. First row = block name.
 * Row 2 (optional): background/hero image(s).
 * Row 3: title (heading), subheading, CTA links.
 *
 * Source structure: <header> ... <div class="grid-layout ...">
 *   <div> <h1> + <p class="subheading"> + <div class="button-group"><a>..</a></div> </div>
 *   <div class="grid-layout ..."> <img> <img> <img> </div>
 */
export default function parse(element, { document }) {
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
  const subheading = element.querySelector('p.subheading, p[class*="subheading"], p');
  const ctas = Array.from(element.querySelectorAll('.button-group a, a.button'));
  const images = Array.from(element.querySelectorAll('img'));

  const cells = [];

  // Row 2: image(s). Hero library expects a single image cell; include all
  // source images so none are dropped.
  if (images.length > 0) {
    cells.push([images]);
  }

  // Row 3: text content (heading, subheading, CTAs).
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctas);

  // Empty-block guard.
  if (!heading && !subheading && images.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-intro', cells });
  element.replaceWith(block);
}
