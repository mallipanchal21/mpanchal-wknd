/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner.
 * Base block: hero.
 * Source: https://wknd-trendsetters.site/ (bottom CTA banner, inverse section)
 * Generated: 2026-08-24
 *
 * Library structure: 1 column, up to 3 rows. First row = block name.
 * Row 2 (optional): background image.
 * Row 3: title (heading), subheading, CTA link.
 *
 * Source structure: <section class="section inverse-section"> ...
 *   <img class="cover-image utility-overlay"> (background)
 *   <div class="overlay"></div>
 *   <div class="card-body"> <h2> + <p class="subheading"> + <div class="button-group"><a></div> </div>
 */
export default function parse(element, { document }) {
  // Background image: the cover/overlay image behind the content.
  const bgImage = element.querySelector('img.cover-image, img[class*="overlay"], img');

  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
  const subheading = element.querySelector('p.subheading, p[class*="subheading"], p');
  const ctas = Array.from(element.querySelectorAll('.button-group a, a.button'));

  const cells = [];

  // Row 2: background image (optional).
  if (bgImage) cells.push([bgImage]);

  // Row 3: text content (heading, subheading, CTAs).
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctas);

  // Empty-block guard.
  if (!heading && !subheading && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
