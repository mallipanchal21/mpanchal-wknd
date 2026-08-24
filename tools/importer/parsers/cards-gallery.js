/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery.
 * Base block: cards.
 * Source: https://wknd-trendsetters.site/ (Image gallery grid)
 * Generated: 2026-08-24
 *
 * This is an image-only gallery: each card is a single image with no text.
 * The cards-gallery block (see blocks/cards-gallery/cards-gallery.js) treats a
 * row whose single div contains only a picture as the card image. So we emit
 * one row per image, each row containing one cell holding the image.
 *
 * Source structure: <div class="grid-layout ..."> containing repeated
 *   <div class="utility-aspect-1x1"><img class="cover-image"></div>.
 */
export default function parse(element, { document }) {
  // Each gallery tile is a direct-child div wrapping one image.
  const tiles = element.querySelectorAll(':scope > div');

  const cells = [];
  tiles.forEach((tile) => {
    const img = tile.querySelector('img');
    if (img) cells.push([img]);
  });

  // Fallback: if no wrapper divs, collect images directly.
  if (cells.length === 0) {
    element.querySelectorAll('img').forEach((img) => cells.push([img]));
  }

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
