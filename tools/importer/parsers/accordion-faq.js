/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq.
 * Base block: accordion.
 * Source: https://wknd-trendsetters.site/ (FAQ accordion section)
 * Generated: 2026-08-24
 *
 * Library structure: 2 columns, multiple rows. First row = block name.
 * Each subsequent row is one accordion item: [title cell, content cell].
 *
 * Source structure: <div class="faq-list"> containing <details class="faq-item">
 *   with <summary class="faq-question"><span>TITLE</span> (+ icon svg)</summary>
 *   and <div class="faq-answer">CONTENT</div>.
 */
export default function parse(element, { document }) {
  // Each FAQ item is a <details class="faq-item"> element (fall back to any details).
  let items = element.querySelectorAll('details.faq-item');
  if (items.length === 0) items = element.querySelectorAll('details');

  const cells = [];
  items.forEach((item) => {
    // Title cell: prefer the inner span text (excludes the icon svg), fall back to summary text.
    const summary = item.querySelector('summary.faq-question, summary');
    const titleSpan = summary ? summary.querySelector('span') : null;
    const titleContent = titleSpan
      || (summary ? document.createTextNode(summary.textContent.trim()) : document.createTextNode(''));

    // Content cell: the answer body.
    const answer = item.querySelector('.faq-answer');
    const contentContent = answer || document.createTextNode('');

    cells.push([titleContent, contentContent]);
  });

  // Empty-block guard: no accordion items found.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
