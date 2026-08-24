import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// Brand logo mark (inline SVG, matches source). Uses currentColor.
/* eslint-disable quotes */
const LOGO_ICON = `<svg viewBox="0 0 33 33" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path d="M28,0H5C2.24,0,0,2.24,0,5v23c0,2.76,2.24,5,5,5h23c2.76,0,5-2.24,5-5V5c0-2.76-2.24-5-5-5ZM29,17c-6.63,0-12,5.37-12,12h-1c0-6.63-5.37-12-12-12v-1c6.63,0,12-5.37,12-12h1c0,6.63,5.37,12,12,12v1Z" fill="currentColor"></path></svg>`;
/* eslint-enable quotes */

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // The first section is the brand column (logo + social icons); the rest are
  // link-nav columns. Tag them generically so CSS can lay them out as a grid.
  const sections = [...footer.children];
  sections.forEach((section, i) => {
    section.classList.add('footer-column');
    if (i === 0) {
      section.classList.add('footer-brand');
      // Prepend the logo mark to the brand link.
      const brandLink = section.querySelector('p a');
      if (brandLink && !brandLink.querySelector('.footer-logo-icon')) {
        const icon = document.createElement('span');
        icon.className = 'footer-logo-icon';
        icon.innerHTML = LOGO_ICON;
        brandLink.prepend(icon);
      }
      // Tag the social-icon list.
      const socialList = section.querySelector('ul');
      if (socialList) socialList.classList.add('footer-social');
    } else {
      section.classList.add('footer-nav');
    }
  });

  block.append(footer);
}
