/**
 * Purpose: Comprehensive unit tests for the HTML rendering system.
 *          Covers html-helpers, block registry, basic-content renderers,
 *          commerce-urgency renderers, and social-forms renderers.
 * Dependencies: vitest, source renderers
 * Related: src/renderers/*, src/design-system/blocks.ts
 */

import { describe, it, expect, beforeEach } from 'vitest';

// ─── html-helpers ───────────────────────────────────────────────────────────────

import {
  escapeHtml,
  cn,
  wrapSection,
  buildResponsiveStyles,
  buildVisibilityClass,
} from '../renderers/html-helpers';

// ─── basic-content renderers ────────────────────────────────────────────────────

import {
  renderHero,
  renderButton,
  renderFaq,
} from '../renderers/basic-content';

// ─── commerce-urgency renderers ─────────────────────────────────────────────────

import {
  renderPricingCard,
  renderCountdown,
} from '../renderers/commerce-urgency';

// ─── social-forms renderers ─────────────────────────────────────────────────────

import {
  renderTestimonial,
  resetSocialFormCss,
} from '../renderers/social-forms';

// ─── Block types ────────────────────────────────────────────────────────────────

import type { Block } from '../design-system/blocks';

// ─── Block registry + full page render (side-effect import registers all blocks) ─

import '../renderers';
import { blockRegistry, renderFullPage } from '../renderers';
import type { BlockTree } from '../design-system/blocks';

// ═══════════════════════════════════════════════════════════════════════════════
// 1. HTML HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

describe('html-helpers', () => {
  // ─── escapeHtml ──────────────────────────────────────────────────────────────

  describe('escapeHtml', () => {
    it('should escape ampersands', () => {
      expect(escapeHtml('foo & bar')).toBe('foo &amp; bar');
    });

    it('should escape less-than signs', () => {
      expect(escapeHtml('1 < 2')).toBe('1 &lt; 2');
    });

    it('should escape greater-than signs', () => {
      expect(escapeHtml('2 > 1')).toBe('2 &gt; 1');
    });

    it('should escape double quotes', () => {
      expect(escapeHtml('say "hello"')).toBe('say &quot;hello&quot;');
    });

    it('should escape single quotes', () => {
      expect(escapeHtml("it's fine")).toBe("it&#039;s fine");
    });

    it('should escape all special characters in one string', () => {
      expect(escapeHtml('<script>alert("xss")&\'</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&amp;&#039;&lt;/script&gt;'
      );
    });

    it('should leave plain text untouched', () => {
      expect(escapeHtml('hello world 123')).toBe('hello world 123');
    });

    it('should handle empty string', () => {
      expect(escapeHtml('')).toBe('');
    });
  });

  // ─── cn (class builder) ─────────────────────────────────────────────────────

  describe('cn', () => {
    it('should join truthy class names with spaces', () => {
      expect(cn('a', 'b', 'c')).toBe('a b c');
    });

    it('should filter out false values', () => {
      expect(cn('a', false, 'b')).toBe('a b');
    });

    it('should filter out null values', () => {
      expect(cn('a', null, 'b')).toBe('a b');
    });

    it('should filter out undefined values', () => {
      expect(cn('a', undefined, 'b')).toBe('a b');
    });

    it('should handle all falsy values', () => {
      expect(cn(false, null, undefined)).toBe('');
    });

    it('should handle conditional classes via short-circuit', () => {
      const isActive = true;
      const isDisabled = false;
      expect(cn('btn', isActive && 'active', isDisabled && 'disabled')).toBe('btn active');
    });

    it('should handle single class', () => {
      expect(cn('only')).toBe('only');
    });

    it('should return empty string for no arguments', () => {
      expect(cn()).toBe('');
    });
  });

  // ─── wrapSection ────────────────────────────────────────────────────────────

  describe('wrapSection', () => {
    it('should wrap content in a section with required attributes', () => {
      const result = wrapSection('<p>hello</p>', {
        id: 'blk-1',
        blockClass: 'ec-hero',
      });

      expect(result).toContain('<section');
      expect(result).toContain('</section>');
      expect(result).toContain('data-block-id="blk-1"');
      expect(result).toContain('data-block-type="ec-hero"');
      expect(result).toContain('class="ec-section ec-hero"');
      expect(result).toContain('<p>hello</p>');
    });

    it('should include ec-container div when container is true (default)', () => {
      const result = wrapSection('content', {
        id: 'blk-2',
        blockClass: 'ec-test',
      });

      expect(result).toContain('class="ec-container"');
      expect(result).toContain('>content</div>');
    });

    it('should skip ec-container when container is false', () => {
      const result = wrapSection('raw', {
        id: 'blk-3',
        blockClass: 'ec-marquee',
        container: false,
      });

      expect(result).not.toContain('ec-container');
      expect(result).toContain('>raw</section>');
    });

    it('should add inline style for backgroundColor', () => {
      const result = wrapSection('x', {
        id: 'blk-4',
        blockClass: 'ec-test',
        backgroundColor: '#ff0000',
      });

      expect(result).toContain('style="background-color:#ff0000"');
    });

    it('should add inline style for custom padding', () => {
      const result = wrapSection('x', {
        id: 'blk-5',
        blockClass: 'ec-test',
        padding: '32px',
      });

      expect(result).toContain('padding:32px');
    });

    it('should include analytics data attribute when provided', () => {
      const result = wrapSection('x', {
        id: 'blk-6',
        blockClass: 'ec-test',
        analyticsId: 'ga-123',
      });

      expect(result).toContain('data-analytics="ga-123"');
    });

    it('should include ab test data attribute when provided', () => {
      const result = wrapSection('x', {
        id: 'blk-7',
        blockClass: 'ec-test',
        abTestId: 'ab-variant-b',
      });

      expect(result).toContain('data-ab="ab-variant-b"');
    });

    it('should include extraClass in class list', () => {
      const result = wrapSection('x', {
        id: 'blk-8',
        blockClass: 'ec-hero',
        extraClass: 'ec-mobile-only',
      });

      expect(result).toContain('ec-section ec-hero ec-mobile-only');
    });
  });

  // ─── buildResponsiveStyles ──────────────────────────────────────────────────

  describe('buildResponsiveStyles', () => {
    it('should return empty string when styles is undefined', () => {
      expect(buildResponsiveStyles('blk-1', undefined)).toBe('');
    });

    it('should return empty string when all style objects are empty', () => {
      expect(buildResponsiveStyles('blk-1', { mobile: {}, tablet: {}, desktop: {} })).toBe('');
    });

    it('should generate mobile rules without media query', () => {
      const styles = { mobile: { fontSize: '14px' } };
      const result = buildResponsiveStyles('blk-1', styles);

      expect(result).toContain('<style>');
      expect(result).toContain('[data-block-id="blk-1"]');
      expect(result).toContain('font-size:14px');
      expect(result).not.toContain('@media');
    });

    it('should generate tablet rules with 768px breakpoint', () => {
      const styles = { tablet: { padding: '24px' } };
      const result = buildResponsiveStyles('blk-1', styles);

      expect(result).toContain('@media(min-width:768px)');
      expect(result).toContain('padding:24px');
    });

    it('should generate desktop rules with 1024px breakpoint', () => {
      const styles = { desktop: { maxWidth: '960px' } };
      const result = buildResponsiveStyles('blk-1', styles);

      expect(result).toContain('@media(min-width:1024px)');
      expect(result).toContain('max-width:960px');
    });

    it('should convert camelCase properties to kebab-case', () => {
      const styles = { mobile: { backgroundColor: '#fff', fontSize: '16px' } };
      const result = buildResponsiveStyles('blk-1', styles);

      expect(result).toContain('background-color:#fff');
      expect(result).toContain('font-size:16px');
    });

    it('should handle all three breakpoints in one call', () => {
      const styles = {
        mobile: { fontSize: '14px' },
        tablet: { fontSize: '16px' },
        desktop: { fontSize: '18px' },
      };
      const result = buildResponsiveStyles('blk-1', styles);

      expect(result).toContain('font-size:14px');
      expect(result).toContain('@media(min-width:768px)');
      expect(result).toContain('font-size:16px');
      expect(result).toContain('@media(min-width:1024px)');
      expect(result).toContain('font-size:18px');
    });
  });

  // ─── buildVisibilityClass ───────────────────────────────────────────────────

  describe('buildVisibilityClass', () => {
    it('should return empty string for "all" visibility', () => {
      expect(buildVisibilityClass('all')).toBe('');
    });

    it('should return "ec-mobile-only" for mobile-only', () => {
      expect(buildVisibilityClass('mobile-only')).toBe('ec-mobile-only');
    });

    it('should return "ec-desktop-only" for desktop-only', () => {
      expect(buildVisibilityClass('desktop-only')).toBe('ec-desktop-only');
    });

    it('should default to empty string when no argument is provided', () => {
      expect(buildVisibilityClass()).toBe('');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. BLOCK REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

describe('Block Registry', () => {
  it('should have registered hero block', () => {
    expect(blockRegistry.has('hero')).toBe(true);
  });

  it('should have registered heading block', () => {
    expect(blockRegistry.has('heading')).toBe(true);
  });

  it('should have registered button block', () => {
    expect(blockRegistry.has('button')).toBe(true);
  });

  it('should have registered pricing-card block', () => {
    expect(blockRegistry.has('pricing-card')).toBe(true);
  });

  it('should have registered testimonial block', () => {
    expect(blockRegistry.has('testimonial')).toBe(true);
  });

  it('should have registered countdown block', () => {
    expect(blockRegistry.has('countdown')).toBe(true);
  });

  it('should have registered faq block', () => {
    expect(blockRegistry.has('faq')).toBe(true);
  });

  it('should NOT have unregistered block types', () => {
    expect(blockRegistry.has('nonexistent-block')).toBe(false);
    expect(blockRegistry.has('')).toBe(false);
  });

  // ─── blockRegistry.render for various block types ───────────────────────────

  it('should render hero block via registry', () => {
    const block: Block = {
      id: 'test-hero',
      type: 'hero',
      props: {
        headline: 'Test Headline',
        ctaText: 'Buy Now',
      },
      visibility: 'all',
    };

    const html = blockRegistry.render(block);
    expect(html).toContain('Test Headline');
    expect(html).toContain('Buy Now');
    expect(html).toContain('ec-hero');
  });

  it('should render heading block via registry', () => {
    const block: Block = {
      id: 'test-heading',
      type: 'heading',
      props: {
        text: 'Section Title',
        level: 'section',
      },
      visibility: 'all',
    };

    const html = blockRegistry.render(block);
    expect(html).toContain('Section Title');
    expect(html).toContain('<h2');
  });

  it('should render button block via registry', () => {
    const block: Block = {
      id: 'test-btn',
      type: 'button',
      props: {
        text: 'Click Me',
        url: 'https://example.com',
        variant: 'primary',
      },
      visibility: 'all',
    };

    const html = blockRegistry.render(block);
    expect(html).toContain('Click Me');
    expect(html).toContain('https://example.com');
    expect(html).toContain('ec-btn-primary');
  });

  it('should render pricing-card block via registry', () => {
    const block: Block = {
      id: 'test-pricing',
      type: 'pricing-card',
      props: {
        title: 'Pro Plan',
        price: '$29',
        features: ['Feature 1', 'Feature 2'],
      },
      visibility: 'all',
    };

    const html = blockRegistry.render(block);
    expect(html).toContain('Pro Plan');
    expect(html).toContain('$29');
    expect(html).toContain('Feature 1');
  });

  it('should render testimonial block via registry', () => {
    resetSocialFormCss();
    const block: Block = {
      id: 'test-testimonial',
      type: 'testimonial',
      props: {
        author: 'Jane Doe',
        quote: 'Great product!',
        rating: 5,
      },
      visibility: 'all',
    };

    const html = blockRegistry.render(block);
    expect(html).toContain('Jane Doe');
    expect(html).toContain('Great product!');
  });

  it('should throw for unknown block type', () => {
    const block: Block = {
      id: 'bad-block',
      type: 'unknown-type',
      props: {},
      visibility: 'all',
    };

    expect(() => blockRegistry.render(block)).toThrow('Unknown block type: unknown-type');
  });

  // ─── renderFullPage ─────────────────────────────────────────────────────────

  describe('renderFullPage', () => {
    it('should produce a complete HTML page with DOCTYPE', () => {
      resetSocialFormCss();
      const tree: BlockTree = {
        version: '1.0',
        pageType: 'product-page',
        palette: 'health-warm',
        blocks: [
          {
            id: 'hero-1',
            type: 'hero',
            props: { headline: 'My Product', ctaText: 'Buy' },
            visibility: 'all',
          },
        ],
        metadata: {
          title: 'Test Product Page',
          description: 'A test page',
        },
      };

      const html = renderFullPage(tree);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html lang="en">');
      expect(html).toContain('<head>');
      expect(html).toContain('<body>');
      expect(html).toContain('</html>');
      expect(html).toContain('<title>Test Product Page</title>');
      expect(html).toContain('My Product');
      expect(html).toContain('viewport');
    });

    it('should include CSS variables in the page head', () => {
      const tree: BlockTree = {
        version: '1.0',
        pageType: 'product-page',
        palette: 'health-warm',
        blocks: [
          {
            id: 'btn-1',
            type: 'button',
            props: { text: 'Go' },
            visibility: 'all',
          },
        ],
        metadata: { title: 'CSS Test', description: '' },
      };

      const html = renderFullPage(tree);

      expect(html).toContain('--color-primary');
      expect(html).toContain('--color-text');
      expect(html).toContain('--color-bg');
    });

    it('should render multiple blocks in order', () => {
      resetSocialFormCss();
      const tree: BlockTree = {
        version: '1.0',
        pageType: 'advertorial',
        palette: 'health-warm',
        blocks: [
          {
            id: 'hero-1',
            type: 'hero',
            props: { headline: 'First', ctaText: 'Go' },
            visibility: 'all',
          },
          {
            id: 'btn-1',
            type: 'button',
            props: { text: 'Second' },
            visibility: 'all',
          },
        ],
        metadata: { title: 'Multi Block', description: '' },
      };

      const html = renderFullPage(tree);

      const firstPos = html.indexOf('First');
      const secondPos = html.indexOf('Second');
      expect(firstPos).toBeGreaterThan(0);
      expect(secondPos).toBeGreaterThan(firstPos);
    });

    it('should escape title and description in meta tags', () => {
      const tree: BlockTree = {
        version: '1.0',
        pageType: 'product-page',
        palette: 'health-warm',
        blocks: [
          {
            id: 'h-1',
            type: 'heading',
            props: { text: 'x' },
            visibility: 'all',
          },
        ],
        metadata: {
          title: 'Test <script>alert(1)</script>',
          description: 'Desc "with quotes" & stuff',
        },
      };

      const html = renderFullPage(tree);

      expect(html).not.toContain('<script>alert(1)</script>');
      expect(html).toContain('&lt;script&gt;');
      expect(html).toContain('&quot;with quotes&quot;');
      expect(html).toContain('&amp;');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. BASIC-CONTENT RENDERERS
// ═══════════════════════════════════════════════════════════════════════════════

describe('basic-content renderers', () => {
  // ─── renderHero ─────────────────────────────────────────────────────────────

  describe('renderHero', () => {
    it('should render headline and CTA button when no URL is provided', () => {
      const block: Block = {
        id: 'hero-1',
        type: 'hero',
        props: {
          headline: 'Transform Your Health',
          ctaText: 'Get Started',
        },
        visibility: 'all',
      };

      const html = renderHero(block);

      expect(html).toContain('Transform Your Health');
      expect(html).toContain('Get Started');
      expect(html).toContain('<button');
      expect(html).toContain('ec-hero');
    });

    it('should render an anchor tag when ctaUrl is provided', () => {
      const block: Block = {
        id: 'hero-2',
        type: 'hero',
        props: {
          headline: 'Headline',
          ctaText: 'Click',
          ctaUrl: 'https://shop.example.com',
        },
        visibility: 'all',
      };

      const html = renderHero(block);

      expect(html).toContain('<a href="https://shop.example.com"');
      expect(html).toContain('>Click</a>');
    });

    it('should render subheadline when provided', () => {
      const block: Block = {
        id: 'hero-3',
        type: 'hero',
        props: {
          headline: 'Headline',
          subheadline: 'Supporting text here',
          ctaText: 'Go',
        },
        visibility: 'all',
      };

      const html = renderHero(block);

      expect(html).toContain('ec-hero-subheadline');
      expect(html).toContain('Supporting text here');
    });

    it('should not render subheadline element when omitted', () => {
      const block: Block = {
        id: 'hero-4',
        type: 'hero',
        props: {
          headline: 'Headline',
          ctaText: 'Go',
        },
        visibility: 'all',
      };

      const html = renderHero(block);

      expect(html).not.toContain('ec-hero-subheadline');
    });

    it('should escape XSS in headline and CTA text', () => {
      const block: Block = {
        id: 'hero-5',
        type: 'hero',
        props: {
          headline: '<script>alert("xss")</script>',
          ctaText: '"><script>xss</script>',
        },
        visibility: 'all',
      };

      const html = renderHero(block);

      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
    });

    it('should apply background image style when backgroundImage is provided', () => {
      const block: Block = {
        id: 'hero-6',
        type: 'hero',
        props: {
          headline: 'H',
          ctaText: 'C',
          backgroundImage: 'https://img.example.com/bg.jpg',
        },
        visibility: 'all',
      };

      const html = renderHero(block);

      expect(html).toContain('background-image');
      expect(html).toContain('url(');
      expect(html).toContain('https://img.example.com/bg.jpg');
      expect(html).toContain('color:#fff');
    });

    it('should center align when alignment is center', () => {
      const block: Block = {
        id: 'hero-7',
        type: 'hero',
        props: {
          headline: 'Centered',
          ctaText: 'Go',
          alignment: 'center',
        },
        visibility: 'all',
      };

      const html = renderHero(block);

      expect(html).toContain('text-align:center');
    });

    it('should include the block id as data-block-id', () => {
      const block: Block = {
        id: 'my-hero-id',
        type: 'hero',
        props: { headline: 'H', ctaText: 'C' },
        visibility: 'all',
      };

      const html = renderHero(block);

      expect(html).toContain('data-block-id="my-hero-id"');
    });
  });

  // ─── renderButton ───────────────────────────────────────────────────────────

  describe('renderButton', () => {
    it('should render a button tag when no URL is provided', () => {
      const block: Block = {
        id: 'btn-1',
        type: 'button',
        props: { text: 'Submit' },
        visibility: 'all',
      };

      const html = renderButton(block);

      expect(html).toContain('<button');
      expect(html).toContain('>Submit</button>');
    });

    it('should render an anchor tag when URL is provided', () => {
      const block: Block = {
        id: 'btn-2',
        type: 'button',
        props: {
          text: 'Learn More',
          url: 'https://example.com/page',
        },
        visibility: 'all',
      };

      const html = renderButton(block);

      expect(html).toContain('<a href="https://example.com/page"');
      expect(html).toContain('>Learn More</a>');
    });

    it('should apply primary variant class by default', () => {
      const block: Block = {
        id: 'btn-3',
        type: 'button',
        props: { text: 'Click' },
        visibility: 'all',
      };

      const html = renderButton(block);

      expect(html).toContain('ec-btn-primary');
    });

    it('should apply secondary variant class when specified', () => {
      const block: Block = {
        id: 'btn-4',
        type: 'button',
        props: {
          text: 'Secondary',
          variant: 'secondary',
        },
        visibility: 'all',
      };

      const html = renderButton(block);

      expect(html).toContain('ec-btn-secondary');
    });

    it('should apply urgency variant class when specified', () => {
      const block: Block = {
        id: 'btn-5',
        type: 'button',
        props: {
          text: 'Hurry!',
          variant: 'urgency',
        },
        visibility: 'all',
      };

      const html = renderButton(block);

      expect(html).toContain('ec-btn-urgency');
    });

    it('should set width:100% when fullWidth is true', () => {
      const block: Block = {
        id: 'btn-6',
        type: 'button',
        props: {
          text: 'Full',
          fullWidth: true,
        },
        visibility: 'all',
      };

      const html = renderButton(block);

      expect(html).toContain('width:100%');
    });

    it('should escape XSS in text and URL', () => {
      const block: Block = {
        id: 'btn-7',
        type: 'button',
        props: {
          text: '<script>alert(1)</script>',
          url: 'https://x.com?a=1&b=2',
        },
        visibility: 'all',
      };

      const html = renderButton(block);

      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
    });
  });

  // ─── renderFaq ──────────────────────────────────────────────────────────────

  describe('renderFaq', () => {
    it('should render FAQ items as details/summary elements', () => {
      const block: Block = {
        id: 'faq-1',
        type: 'faq',
        props: {
          items: [
            { question: 'What is this?', answer: 'A great product.' },
            { question: 'How does it work?', answer: 'Very well.' },
          ],
        },
        visibility: 'all',
      };

      const html = renderFaq(block);

      expect(html).toContain('<details');
      expect(html).toContain('<summary');
      expect(html).toContain('What is this?');
      expect(html).toContain('A great product.');
      expect(html).toContain('How does it work?');
      expect(html).toContain('Very well.');
    });

    it('should wrap items in a dl element', () => {
      const block: Block = {
        id: 'faq-2',
        type: 'faq',
        props: {
          items: [{ question: 'Q?', answer: 'A.' }],
        },
        visibility: 'all',
      };

      const html = renderFaq(block);

      expect(html).toContain('<dl class="ec-faq"');
      expect(html).toContain('</dl>');
    });

    it('should include chevron in summary', () => {
      const block: Block = {
        id: 'faq-3',
        type: 'faq',
        props: {
          items: [{ question: 'Q?', answer: 'A.' }],
        },
        visibility: 'all',
      };

      const html = renderFaq(block);

      expect(html).toContain('ec-faq-chevron');
    });

    it('should include CSS for open state rotation', () => {
      const block: Block = {
        id: 'faq-4',
        type: 'faq',
        props: {
          items: [{ question: 'Q?', answer: 'A.' }],
        },
        visibility: 'all',
      };

      const html = renderFaq(block);

      expect(html).toContain('details[open]');
      expect(html).toContain('transform:rotate(180deg)');
    });

    it('should escape XSS in questions and answers', () => {
      const block: Block = {
        id: 'faq-5',
        type: 'faq',
        props: {
          items: [
            {
              question: '<img src=x onerror=alert(1)>',
              answer: '"><script>x</script>',
            },
          ],
        },
        visibility: 'all',
      };

      const html = renderFaq(block);

      // escapeHtml turns < into &lt; and > into &gt;, so raw HTML tags are neutered
      expect(html).not.toContain('<script>');
      expect(html).not.toContain('<img ');
      expect(html).toContain('&lt;img');
      expect(html).toContain('&lt;script&gt;');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 4. COMMERCE-URGENCY RENDERERS
// ═══════════════════════════════════════════════════════════════════════════════

describe('commerce-urgency renderers', () => {
  // ─── renderPricingCard ──────────────────────────────────────────────────────

  describe('renderPricingCard', () => {
    it('should render title, price, and features', () => {
      const block: Block = {
        id: 'price-1',
        type: 'pricing-card',
        props: {
          title: 'Starter Plan',
          price: '$19',
          features: ['1 User', '5 Projects', 'Basic Support'],
        },
        visibility: 'all',
      };

      const html = renderPricingCard(block);

      expect(html).toContain('Starter Plan');
      expect(html).toContain('$19');
      expect(html).toContain('1 User');
      expect(html).toContain('5 Projects');
      expect(html).toContain('Basic Support');
    });

    it('should show original price with strikethrough when provided', () => {
      const block: Block = {
        id: 'price-2',
        type: 'pricing-card',
        props: {
          title: 'Pro',
          price: '$29',
          originalPrice: '$59',
          features: ['All features'],
        },
        visibility: 'all',
      };

      const html = renderPricingCard(block);

      expect(html).toContain('$59');
      expect(html).toContain('text-decoration:line-through');
    });

    it('should show "Most Popular" badge when popular is true', () => {
      const block: Block = {
        id: 'price-3',
        type: 'pricing-card',
        props: {
          title: 'Best Value',
          price: '$49',
          features: ['Everything'],
          popular: true,
        },
        visibility: 'all',
      };

      const html = renderPricingCard(block);

      expect(html).toContain('Most Popular');
      expect(html).toContain('border:2px solid var(--color-primary)');
    });

    it('should render CTA button when ctaText is provided', () => {
      const block: Block = {
        id: 'price-4',
        type: 'pricing-card',
        props: {
          title: 'Plan',
          price: '$10',
          features: ['F1'],
          ctaText: 'Select Plan',
        },
        visibility: 'all',
      };

      const html = renderPricingCard(block);

      expect(html).toContain('Select Plan');
      expect(html).toContain('<button');
    });

    it('should not render CTA button when ctaText is omitted', () => {
      const block: Block = {
        id: 'price-5',
        type: 'pricing-card',
        props: {
          title: 'Plan',
          price: '$10',
          features: ['F1'],
        },
        visibility: 'all',
      };

      const html = renderPricingCard(block);

      // Only the wrapping section should contain <button, not a CTA button
      const buttonMatches = html.match(/<button/g);
      expect(buttonMatches).toBeNull();
    });

    it('should display checkmarks next to features', () => {
      const block: Block = {
        id: 'price-6',
        type: 'pricing-card',
        props: {
          title: 'Plan',
          price: '$10',
          features: ['Feature A'],
        },
        visibility: 'all',
      };

      const html = renderPricingCard(block);

      expect(html).toContain('&#10003;');
    });

    it('should escape XSS in title, price, and features', () => {
      const block: Block = {
        id: 'price-7',
        type: 'pricing-card',
        props: {
          title: '<script>alert("xss")</script>',
          price: '$<img src=x>',
          features: ['<b>bold</b>'],
        },
        visibility: 'all',
      };

      const html = renderPricingCard(block);

      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
    });

    it('should include block id as data attribute', () => {
      const block: Block = {
        id: 'price-id-123',
        type: 'pricing-card',
        props: {
          title: 'T',
          price: '$1',
          features: ['F'],
        },
        visibility: 'all',
      };

      const html = renderPricingCard(block);

      expect(html).toContain('data-block-id="price-id-123"');
    });
  });

  // ─── renderCountdown ────────────────────────────────────────────────────────

  describe('renderCountdown', () => {
    it('should render a countdown timer with default label', () => {
      const block: Block = {
        id: 'cd-1',
        type: 'countdown',
        props: {
          minutes: 14,
        },
        visibility: 'all',
      };

      const html = renderCountdown(block);

      expect(html).toContain('Offer Ends In');
      expect(html).toContain('14:59');
    });

    it('should use custom label when provided', () => {
      const block: Block = {
        id: 'cd-2',
        type: 'countdown',
        props: {
          minutes: 10,
          label: 'Hurry! Ends in',
        },
        visibility: 'all',
      };

      const html = renderCountdown(block);

      expect(html).toContain('Hurry! Ends in');
    });

    it('should use cart reservation label when cartReservation is true', () => {
      const block: Block = {
        id: 'cd-3',
        type: 'countdown',
        props: {
          minutes: 5,
          cartReservation: true,
        },
        visibility: 'all',
      };

      const html = renderCountdown(block);

      expect(html).toContain('Cart Reserved For');
    });

    it('should render data attributes for JS hydration', () => {
      const block: Block = {
        id: 'cd-4',
        type: 'countdown',
        props: {
          endDate: '2025-12-31T23:59:59Z',
          minutes: 30,
        },
        visibility: 'all',
      };

      const html = renderCountdown(block);

      expect(html).toContain('data-end-date="2025-12-31T23:59:59Z"');
      expect(html).toContain('data-minutes="30"');
    });

    it('should apply medium urgency colors by default', () => {
      const block: Block = {
        id: 'cd-5',
        type: 'countdown',
        props: { minutes: 15 },
        visibility: 'all',
      };

      const html = renderCountdown(block);

      // Medium urgency: bg=#fed7aa, text=#9a3412
      expect(html).toContain('#fed7aa');
      expect(html).toContain('#9a3412');
    });

    it('should apply high urgency colors and pulse animation', () => {
      const block: Block = {
        id: 'cd-6',
        type: 'countdown',
        props: {
          minutes: 5,
          urgency: 'high',
        },
        visibility: 'all',
      };

      const html = renderCountdown(block);

      // High urgency: bg=#fecaca, text=#fff
      expect(html).toContain('#fecaca');
      expect(html).toContain('ec-pulse');
    });

    it('should apply low urgency colors', () => {
      const block: Block = {
        id: 'cd-7',
        type: 'countdown',
        props: {
          minutes: 60,
          urgency: 'low',
        },
        visibility: 'all',
      };

      const html = renderCountdown(block);

      // Low urgency: bg=#dbeafe, text=#1e40af
      expect(html).toContain('#dbeafe');
      expect(html).toContain('#1e40af');
    });

    it('should pad minutes with leading zero', () => {
      const block: Block = {
        id: 'cd-8',
        type: 'countdown',
        props: { minutes: 5 },
        visibility: 'all',
      };

      const html = renderCountdown(block);

      expect(html).toContain('05:59');
    });

    it('should show default 14:59 when no minutes specified', () => {
      const block: Block = {
        id: 'cd-9',
        type: 'countdown',
        props: {},
        visibility: 'all',
      };

      const html = renderCountdown(block);

      expect(html).toContain('14:59');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 5. SOCIAL-FORMS RENDERERS
// ═══════════════════════════════════════════════════════════════════════════════

describe('social-forms renderers', () => {
  beforeEach(() => {
    // Reset CSS injection state between tests so each test can get the CSS block
    resetSocialFormCss();
  });

  // ─── renderTestimonial ─────────────────────────────────────────────────────

  describe('renderTestimonial', () => {
    it('should render quote and author', () => {
      const block: Block = {
        id: 'testi-1',
        type: 'testimonial',
        props: {
          author: 'Sarah Johnson',
          quote: 'This product changed my life!',
        },
        visibility: 'all',
      };

      const html = renderTestimonial(block);

      expect(html).toContain('Sarah Johnson');
      expect(html).toContain('This product changed my life!');
    });

    it('should render star rating when provided', () => {
      const block: Block = {
        id: 'testi-2',
        type: 'testimonial',
        props: {
          author: 'Bob',
          quote: 'Good stuff',
          rating: 4,
        },
        visibility: 'all',
      };

      const html = renderTestimonial(block);

      // Stars: &#9733; (filled) and &#9734; (empty)
      expect(html).toContain('ec-stars');
      expect(html).toContain('&#9733;');
      expect(html).toContain('&#9734;');
    });

    it('should not render stars when rating is omitted', () => {
      const block: Block = {
        id: 'testi-3',
        type: 'testimonial',
        props: {
          author: 'Alice',
          quote: 'Nice',
        },
        visibility: 'all',
      };

      const html = renderTestimonial(block);

      // The shared CSS block may reference .ec-stars, so check the actual element
      expect(html).not.toContain('<span class="ec-stars">');
    });

    it('should render avatar image when provided', () => {
      const block: Block = {
        id: 'testi-4',
        type: 'testimonial',
        props: {
          author: 'Carol',
          quote: 'Great',
          avatar: 'https://img.example.com/carol.jpg',
        },
        visibility: 'all',
      };

      const html = renderTestimonial(block);

      expect(html).toContain('ec-testimonial-avatar');
      expect(html).toContain('src="https://img.example.com/carol.jpg"');
    });

    it('should render title/role when provided', () => {
      const block: Block = {
        id: 'testi-5',
        type: 'testimonial',
        props: {
          author: 'Dave',
          quote: 'Amazing',
          title: 'CEO at Acme Corp',
        },
        visibility: 'all',
      };

      const html = renderTestimonial(block);

      expect(html).toContain('CEO at Acme Corp');
      expect(html).toContain('ec-testimonial-title');
    });

    it('should wrap content in a blockquote with ec-testimonial class', () => {
      const block: Block = {
        id: 'testi-6',
        type: 'testimonial',
        props: {
          author: 'Eve',
          quote: 'Love it',
        },
        visibility: 'all',
      };

      const html = renderTestimonial(block);

      expect(html).toContain('<blockquote class="ec-testimonial"');
      expect(html).toContain('</blockquote>');
    });

    it('should include opening quote mark', () => {
      const block: Block = {
        id: 'testi-7',
        type: 'testimonial',
        props: {
          author: 'Frank',
          quote: 'Wonderful',
        },
        visibility: 'all',
      };

      const html = renderTestimonial(block);

      expect(html).toContain('ec-testimonial-quote-mark');
    });

    it('should escape XSS in author and quote', () => {
      const block: Block = {
        id: 'testi-8',
        type: 'testimonial',
        props: {
          author: '<script>alert(1)</script>',
          quote: '"><img src=x onerror=alert(1)>',
        },
        visibility: 'all',
      };

      const html = renderTestimonial(block);

      // escapeHtml turns < into &lt; and > into &gt; so tags are neutered
      expect(html).not.toContain('<script>');
      expect(html).not.toContain('<img ');
      expect(html).toContain('&lt;script&gt;');
    });

    it('should include block id as data attribute', () => {
      const block: Block = {
        id: 'testi-id-999',
        type: 'testimonial',
        props: {
          author: 'Gina',
          quote: 'Fine',
        },
        visibility: 'all',
      };

      const html = renderTestimonial(block);

      expect(html).toContain('data-block-id="testi-id-999"');
    });

    it('should inject shared CSS on first render', () => {
      const block: Block = {
        id: 'testi-css',
        type: 'testimonial',
        props: {
          author: 'Hal',
          quote: 'Ok',
        },
        visibility: 'all',
      };

      const html = renderTestimonial(block);

      // The shared CSS includes classes like ec-testimonial, ec-stars, etc.
      expect(html).toContain('<style>');
      expect(html).toContain('.ec-testimonial');
    });
  });
});
