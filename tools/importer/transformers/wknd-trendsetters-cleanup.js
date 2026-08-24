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
  if (hookName === TransformHook.afterTransform) {
    // Global chrome that authors would never create when authoring a page.
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      'div.navbar',
      'footer.footer',
    ]);
  }
}
