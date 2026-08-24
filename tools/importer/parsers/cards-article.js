/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article.
 * Base block: cards.
 * Source: https://wknd-trendsetters.site/ (Latest articles cards)
 * Generated: 2026-08-24
 *
 * Library structure: 2 columns, multiple rows. First row = block name.
 * Each subsequent row is one card: [image cell, text-content cell].
 *
 * Source structure: <div class="grid-layout ..."> containing
 *   <a class="article-card card-link" href="..."> with
 *     <div class="article-card-image"><img></div>
 *     <div class="article-card-body">
 *       <div class="article-card-meta"><span class="tag">..</span><span>date</span></div>
 *       <h3>title</h3>
 *     </div>
 */
export default function parse(element, { document }) {
  // Each card is a top-level anchor/article in the grid.
  const cards = element.querySelectorAll(':scope > a.article-card, :scope > .article-card');

  const cells = [];
  cards.forEach((card) => {
    // Image cell: the card image (mandatory in library).
    const img = card.querySelector('.article-card-image img, img');

    // Text cell: preserve the meta + heading. The whole source card is a link,
    // so wrap the heading in an anchor to keep it clickable without duplicating text.
    const textCell = [];
    const body = card.querySelector('.article-card-body');
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
    const href = card.getAttribute('href');

    if (heading && href) {
      const link = document.createElement('a');
      link.href = href;
      // Move heading's children into the link, keep heading element as wrapper.
      link.append(...heading.childNodes);
      heading.append(link);
    }

    if (body) {
      textCell.push(body);
    } else if (heading) {
      textCell.push(heading);
    }

    cells.push([img || document.createTextNode(''), textCell]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
