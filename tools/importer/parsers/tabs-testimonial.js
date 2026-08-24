/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial.
 * Base block: tabs.
 * Source: https://wknd-trendsetters.site/ (testimonials tabs)
 * Generated: 2026-08-24
 *
 * Library structure: 2 columns, multiple rows. First row = block name.
 * Each subsequent row is one tab: [tab label cell, tab content cell].
 *
 * Source structure: <div class="tabs-wrapper">
 *   <div class="tabs-content">
 *     <div class="tab-pane" data-tab-index="N"> ...panel content (image + name/role + quote)... </div>
 *   </div>
 *   <div class="tab-menu">
 *     <button class="tab-menu-link" data-tab-target="N"> ...avatar + name + role... </button>
 *   </div>
 * The label lives in the tab-menu button; the content lives in the matching pane.
 */
export default function parse(element, { document }) {
  const panes = Array.from(element.querySelectorAll('.tabs-content .tab-pane, .tab-pane'));
  const buttons = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu button, button.tab-menu-link'));

  const cells = [];

  panes.forEach((pane, i) => {
    const paneIndex = pane.getAttribute('data-tab-index');
    // Match the menu button by its data-tab-target; fall back to positional order.
    let button = buttons.find((b) => b.getAttribute('data-tab-target') === paneIndex);
    if (!button) button = buttons[i];

    // Label cell: prefer the menu button's inner content (name + role).
    // Use the text-only wrapper (skip avatar image) so the label reads as text.
    let labelContent = document.createTextNode('');
    if (button) {
      const textWrap = button.querySelector('div[style*="text-align"], .flex-horizontal > div:last-child');
      labelContent = textWrap || document.createTextNode(button.textContent.trim());
    }

    // Content cell: the panel's inner content.
    const contentInner = pane.querySelector(':scope > .grid-layout, :scope > div');
    const contentContent = contentInner || pane;

    cells.push([labelContent, contentContent]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
