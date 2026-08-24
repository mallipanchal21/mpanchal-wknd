/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters site-wide cleanup.
 * All selectors verified against migration-work/cleaned.html.
 *
 * Non-authorable site chrome removed:
 *  - a.skip-link            -> "Skip to main content" accessibility link (body > a.skip-link)
 *  - div.navbar             -> top navigation bar w/ logo, mega-menu, dropdowns, mobile toggle
 *  - footer.footer          -> global footer w/ logo, social icons, link columns
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Normalize card grids whose items are block-wrapping <a> elements
    // (<a class="trend-card"><div>…</div></a>). html2md's preprocessing collapses
    // consecutive block-level anchors, dropping all but the first card. Rewrite
    // each such anchor to a <div> that carries the href on a data attribute, and
    // wrap the card heading in a real inline <a> so the link survives. This runs
    // BEFORE html2md preprocessing, so the cards reach the parser intact.
    const doc = (payload && payload.document) || element.ownerDocument;
    element.querySelectorAll('a.trend-card, a.article-card').forEach((card) => {
      const href = card.getAttribute('href');
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
      if (href && heading && !heading.querySelector('a')) {
        const link = doc.createElement('a');
        link.href = href;
        link.append(...heading.childNodes);
        heading.append(link);
      }
      const div = doc.createElement('div');
      div.className = card.className;
      if (href) div.setAttribute('data-href', href);
      div.append(...card.childNodes);
      card.replaceWith(div);
    });
  }
  if (hookName === TransformHook.afterTransform) {
    // Global chrome that authors would never create when authoring a page.
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      'div.navbar',
      'footer.footer',
    ]);
  }
}
