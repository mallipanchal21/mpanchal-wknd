/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-intro.js
  function parse(element, { document: document2 }) {
    const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
    const subheading = element.querySelector('p.subheading, p[class*="subheading"], p');
    const ctas = Array.from(element.querySelectorAll(".button-group a, a.button"));
    const images = Array.from(element.querySelectorAll("img"));
    const cells = [];
    if (images.length > 0) {
      cells.push([images]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctas);
    if (!heading && !subheading && images.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-intro", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document: document2 }) {
    const columns = element.querySelectorAll(":scope > div");
    if (columns.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const row = Array.from(columns);
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document: document2 }) {
    const tiles = element.querySelectorAll(":scope > div");
    const cells = [];
    tiles.forEach((tile) => {
      const img = tile.querySelector("img");
      if (img) cells.push([img]);
    });
    if (cells.length === 0) {
      element.querySelectorAll("img").forEach((img) => cells.push([img]));
    }
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse4(element, { document: document2 }) {
    const panes = Array.from(element.querySelectorAll(".tabs-content .tab-pane, .tab-pane"));
    const buttons = Array.from(element.querySelectorAll(".tab-menu .tab-menu-link, .tab-menu button, button.tab-menu-link"));
    const cells = [];
    panes.forEach((pane, i) => {
      const paneIndex = pane.getAttribute("data-tab-index");
      let button = buttons.find((b) => b.getAttribute("data-tab-target") === paneIndex);
      if (!button) button = buttons[i];
      let labelContent = document2.createTextNode("");
      if (button) {
        const textWrap = button.querySelector('div[style*="text-align"], .flex-horizontal > div:last-child');
        labelContent = textWrap || document2.createTextNode(button.textContent.trim());
      }
      const contentInner = pane.querySelector(":scope > .grid-layout, :scope > div");
      const contentContent = contentInner || pane;
      cells.push([labelContent, contentContent]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document: document2 }) {
    const cards = element.querySelectorAll(":scope > a.article-card, :scope > .article-card");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".article-card-image img, img");
      const textCell = [];
      const body = card.querySelector(".article-card-body");
      const heading = card.querySelector("h1, h2, h3, h4, h5, h6");
      const href = card.getAttribute("href");
      if (heading && href) {
        const link = document2.createElement("a");
        link.href = href;
        link.append(...heading.childNodes);
        heading.append(link);
      }
      if (body) {
        textCell.push(body);
      } else if (heading) {
        textCell.push(heading);
      }
      cells.push([img || document2.createTextNode(""), textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document: document2 }) {
    let items = element.querySelectorAll("details.faq-item");
    if (items.length === 0) items = element.querySelectorAll("details");
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector("summary.faq-question, summary");
      const titleSpan = summary ? summary.querySelector("span") : null;
      const titleContent = titleSpan || (summary ? document2.createTextNode(summary.textContent.trim()) : document2.createTextNode(""));
      const answer = item.querySelector(".faq-answer");
      const contentContent = answer || document2.createTextNode("");
      cells.push([titleContent, contentContent]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse7(element, { document: document2 }) {
    const bgImage = element.querySelector('img.cover-image, img[class*="overlay"], img');
    const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
    const subheading = element.querySelector('p.subheading, p[class*="subheading"], p');
    const ctas = Array.from(element.querySelectorAll(".button-group a, a.button"));
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctas);
    if (!heading && !subheading && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        "div.navbar",
        "footer.footer"
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "WKND Trendsetters fashion blog homepage with hero, featured article, image gallery, testimonials tabs, latest articles cards, FAQ accordion, and CTA banner",
    urls: [
      "https://wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "hero-intro",
        instances: ["#main-content > header.section.secondary-section"]
      },
      {
        name: "columns-article",
        instances: ["#main-content > section.section:nth-of-type(1) > div.container > div.grid-layout"]
      },
      {
        name: "cards-gallery",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.grid-layout.desktop-4-column.grid-gap-sm"]
      },
      {
        name: "tabs-testimonial",
        instances: ["#main-content > section.section:nth-of-type(3) > div.container > div.tabs-wrapper"]
      },
      {
        name: "cards-article",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.grid-layout.desktop-4-column.grid-gap-md"]
      },
      {
        name: "accordion-faq",
        instances: ["#main-content > section.section:nth-of-type(5) > div.container > div.grid-layout > div.faq-list"]
      },
      {
        name: "hero-banner",
        instances: ["#main-content > section.section.inverse-section"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero intro",
        selector: "#main-content > header.section.secondary-section",
        style: "light",
        blocks: ["hero-intro"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Image gallery",
        selector: "#main-content > section.section.secondary-section:nth-of-type(2)",
        style: "light",
        blocks: ["cards-gallery"],
        defaultContent: [
          "#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.utility-text-align-center.utility-margin-bottom-8rem > h2.h2-heading",
          "#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.utility-text-align-center.utility-margin-bottom-8rem > p.paragraph-lg"
        ]
      },
      {
        id: "section-5",
        name: "Latest articles",
        selector: "#main-content > section.section.secondary-section:nth-of-type(4)",
        style: "light",
        blocks: ["cards-article"],
        defaultContent: [
          "#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.utility-text-align-center > h2.h2-heading",
          "#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.utility-text-align-center > p.paragraph-lg"
        ]
      }
    ]
  };
  var parsers = {
    "hero-intro": parse,
    "columns-article": parse2,
    "cards-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-banner": parse7
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
