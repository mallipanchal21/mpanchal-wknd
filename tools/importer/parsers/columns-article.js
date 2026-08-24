/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-article.
 * Base block: columns.
 * Source: https://wknd-trendsetters.site/ (Featured article, image + text side by side)
 * Generated: 2026-08-24
 *
 * Library structure: columns block — first row = block name, second row has one
 * cell per visual column. Here the content is two columns: an image column and a
 * text column (breadcrumbs, heading, author/date meta).
 *
 * Source structure: <div class="grid-layout ..."> with two direct-child <div>s:
 *   1) <div><img class="cover-image"></div>
 *   2) <div> breadcrumbs + <h2> + author/date meta </div>
 */
export default function parse(element, { document }) {
  // The two visual columns are the direct-child divs of the grid layout.
  const columns = element.querySelectorAll(':scope > div');

  // Empty-block guard: need at least one column of content.
  if (columns.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Single content row: one cell per column, in source (visual) order.
  const row = Array.from(columns);

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
