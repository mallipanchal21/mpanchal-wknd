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

  // tools/importer/import-trend-landing.js
  var import_trend_landing_exports = {};
  __export(import_trend_landing_exports, {
    default: () => import_trend_landing_default
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

  // tools/importer/parsers/cards-article.js
  function parse2(element, { document: document2 }) {
    const cards = element.querySelectorAll("a.article-card, .article-card, a.trend-card, .trend-card");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".article-card-image img, .trend-card-image img, img");
      const textCell = [];
      const body = card.querySelector(".article-card-body, .trend-card-body");
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

  // tools/importer/parsers/columns-article.js
  function parse3(element, { document: document2 }) {
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

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      const doc = payload && payload.document || element.ownerDocument;
      element.querySelectorAll("a.trend-card, a.article-card").forEach((card) => {
        const href = card.getAttribute("href");
        const heading = card.querySelector("h1, h2, h3, h4, h5, h6");
        if (href && heading && !heading.querySelector("a")) {
          const link = doc.createElement("a");
          link.href = href;
          link.append(...heading.childNodes);
          heading.append(link);
        }
        const div = doc.createElement("div");
        div.className = card.className;
        if (href) div.setAttribute("data-href", href);
        div.append(...card.childNodes);
        card.replaceWith(div);
      });
    }
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

  // tools/importer/import-trend-landing.js
  var PAGE_TEMPLATE = {
    name: "trend-landing",
    description: "Landing page with two-image hero, a card grid of trend items, a feature columns section, and a CTA banner",
    urls: [
      "https://wknd-trendsetters.site/fashion-trends-young-adults-casual-sport"
    ],
    blocks: [
      {
        name: "hero-intro",
        instances: ["#main-content > header.section.secondary-section"]
      },
      {
        name: "cards-article",
        instances: ["#trends > div.container > div.grid-layout.desktop-4-column"]
      },
      {
        name: "columns-article",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.grid-layout"]
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
        id: "section-2",
        name: "Trend alert",
        selector: "#trends",
        style: null,
        blocks: ["cards-article"],
        defaultContent: [
          "#trends > div.container > div.utility-text-align-center > h2.h2-heading",
          "#trends > div.container > div.utility-text-align-center > p.paragraph-lg"
        ]
      },
      {
        id: "section-3",
        name: "Feature",
        selector: "#main-content > section.section.secondary-section:nth-of-type(2)",
        style: "light",
        blocks: ["columns-article"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "CTA banner",
        selector: "#main-content > section.section.accent-section",
        style: "accent",
        blocks: [],
        defaultContent: ["#main-content > section.section.accent-section > div.container"]
      }
    ]
  };
  var parsers = {
    "hero-intro": parse,
    "cards-article": parse2,
    "columns-article": parse3
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
  function normalizeCardAnchors(document2) {
    document2.querySelectorAll("a.trend-card, a.article-card").forEach((card) => {
      const href = card.getAttribute("href");
      const heading = card.querySelector("h1, h2, h3, h4, h5, h6");
      if (href && heading && !heading.querySelector("a")) {
        const link = document2.createElement("a");
        link.href = href;
        link.append(...heading.childNodes);
        heading.append(link);
      }
      const div = document2.createElement("div");
      div.className = card.className;
      div.append(...card.childNodes);
      card.replaceWith(div);
    });
  }
  var import_trend_landing_default = {
    onLoad: ({ document: document2 }) => {
      normalizeCardAnchors(document2);
    },
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
  return __toCommonJS(import_trend_landing_exports);
})();
