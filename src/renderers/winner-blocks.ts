/**
 * Purpose: Block renderers for winner-pattern blocks — visual elements extracted
 *          from winning advertorial HTML pages (Clarifion, Vibriance, Rejuvera, etc.).
 * Dependencies: blocks.ts (Block), html-helpers.ts
 * Related: editorial-blocks.ts, basic-content.ts, social-forms.ts
 *
 * WHY: Winner analysis revealed 4 block patterns that ALL top advertorials use
 *      but ECOM-AI didn't have. Adding these closes the visual gap:
 *      1. numbered-benefits — "7 Reasons Why" grid (Particle, Javvy, Hike)
 *      2. media-badges — "As Seen On" logos (Clarifion, Vibriance)
 *      3. facebook-post — organic social proof card (Clarifion)
 *      4. doctor-endorsement — expert credibility (Vibriance, Rejuvera)
 */

import type { Block } from '../design-system/blocks';
import {
  escapeHtml,
  wrapSection,
  getProps,
  cn,
  buildResponsiveStyles,
  buildVisibilityClass,
  getRandomDoctorAvatar,
  getRandomAvatar,
  renderIcon,
} from './html-helpers';

// ─── 1. Numbered Benefits ──────────────────────────────────────────────────────

interface NumberedBenefitsProps {
  items: Array<{
    number?: number;
    headline: string;
    description?: string;
    icon?: string;
  }>;
  accentColor?: string;
}

/**
 * WHY: Particle Face Cream, Javvy Coffee, Hike Footwear winners ALL use this pattern.
 *      Large colored number + bold benefit headline + short paragraph.
 *      Readers SCAN the numbers and headlines, read paragraphs only if hooked.
 *      This is the #1 conversion pattern in listicle/reason-why advertorials.
 *
 * Visual structure per item:
 *   [BIG NUMBER]  [BOLD HEADLINE]
 *               [Short description paragraph]
 */
export function renderNumberedBenefits(block: Block): string {
  const props = getProps<NumberedBenefitsProps>(block);
  const accentColor = props.accentColor ?? '#2D6A4F';
  const items = Array.isArray(props.items) ? props.items : [];

  const itemsHtml = items.map((item, index) => {
    const num = item.number ?? index + 1;
    const headline = typeof item === 'string' ? item : item.headline;
    const desc = item.description || '';

    // WHY: Large colored number (48px, bold) — matches Particle winner exactly
    const numHtml = `<div style="font-family:'Inter',sans-serif;font-size:48px;font-weight:800;color:${accentColor};line-height:1;min-width:56px;opacity:0.85;">${num}</div>`;

    const headlineHtml = `<div style="font-family:'Inter',sans-serif;font-size:18px;font-weight:700;color:#1B1B1B;line-height:1.3;margin-bottom:4px;">${escapeHtml(headline)}</div>`;

    const descHtml = desc
      ? `<div style="font-family:'Inter',sans-serif;font-size:15px;line-height:1.6;color:#4B5563;">${escapeHtml(desc)}</div>`
      : '';

    return `<div style="display:flex;gap:16px;align-items:flex-start;padding:20px 0;${index < items.length - 1 ? 'border-bottom:1px solid #E5E7EB;' : ''}">
      ${numHtml}
      <div style="flex:1;">${headlineHtml}${descHtml}</div>
    </div>`;
  }).join('\n');

  const content = `<div class="ec-numbered-benefits">${itemsHtml}</div>`;

  const visClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  return `${responsiveStyles}${wrapSection(content, {
    id: block.id,
    blockClass: cn('ec-numbered-benefits-block', visClass),
  })}`;
}

// ─── 2. Media Badges ("As Seen On") ────────────────────────────────────────────

interface MediaBadgeItem {
  name: string;
  logoUrl?: string;
  icon?: string;
}

interface MediaBadgesProps {
  headline?: string;
  badges: MediaBadgeItem[];
}

/**
 * WHY: Clarifion, Vibriance, SmoothSpire winners show "As Seen On" media logos
 *      in the header area. This builds instant credibility.
 *      Pattern: Gray separator line, "As Seen On" text, row of media logos.
 *      NOTE: Winners use styled text logos (italic serif) or image logos, not plain text.
 *
 * Visual structure:
 *   ─── As Seen On ───
 *   [Forbes]  [GQ]  [Men's Journal]  [SHAPE]
 */
export function renderMediaBadges(block: Block): string {
  const props = getProps<MediaBadgesProps>(block);
  const headline = props.headline ?? 'As Seen On';
  const badges = Array.isArray(props.badges) ? props.badges : [];

  // WHY: Style each badge name as a faux-logo — italic serif, muted color
  //      Matches winner pattern where text logos look like real publications
  const badgeItems = badges.map(badge => {
    const b = typeof badge === 'string' ? { name: badge } : badge;

    if (b.logoUrl) {
      return `<div style="display:flex;align-items:center;justify-content:center;padding:4px 12px;">
        <img src="${escapeHtml(b.logoUrl)}" alt="${escapeHtml(b.name)}" style="height:24px;width:auto;opacity:0.4;filter:grayscale(100%);" loading="lazy">
      </div>`;
    }

    // WHY: Italic serif font + muted gray = looks like a real media publication logo
    return `<div style="display:flex;align-items:center;justify-content:center;padding:4px 12px;">
      <span style="font-family:'Open Sans',sans-serif;font-size:16px;font-weight:400;font-style:italic;color:#9AA0AB;letter-spacing:0.02em;">${escapeHtml(b.name)}</span>
    </div>`;
  }).join('');

  // WHY: Light gray bg + subtle borders — matches news-site credibility bar
  const content = `
    <div style="text-align:center;padding:10px 0;">
      <div style="font-family:'Inter',sans-serif;font-size:11px;font-weight:600;color:#9AA0AB;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:6px;">${escapeHtml(headline)}</div>
      <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:4px;align-items:center;">
        ${badgeItems}
      </div>
    </div>
  `;

  const visClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  const bgStyle = `<style>
    [data-block-id="${block.id}"]{background:#f8f9fa;border-top:1px solid #E5E7EB;border-bottom:1px solid #E5E7EB;}
  </style>`;

  return `${bgStyle}${responsiveStyles}${wrapSection(content, {
    id: block.id,
    blockClass: cn('ec-media-badges', visClass),
  })}`;
}

// ─── 3. Facebook Post ──────────────────────────────────────────────────────────

interface FacebookPostProps {
  authorName: string;
  authorAvatar?: string;
  timeAgo?: string;
  text: string;
  imageUrl?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  topComment?: string;
  topCommentAuthor?: string;
}

/**
 * WHY: Clarifion winner uses Facebook-style posts as social proof. These feel
 *      ORGANIC — like real customers sharing, not staged testimonials.
 *      Pattern: Facebook card with avatar, name, timestamp, post text, image,
 *      like/comment/share counts, and a top comment.
 *
 * Visual structure:
 *   ┌─────────────────────────────────────┐
 *   │ [Avatar] Author Name    2h · 🌐     │
 *   │                                     │
 *   │ Post text about the product...      │
 *   │                                     │
 *   │ [Image]                             │
 *   │                                     │
 *   │ 👍 142   💬 23   ↗️ 5              │
 *   │─────────────────────────────────────│
 *   │ [Avatar] Top Comment Author         │
 *   │ Comment text...                     │
 *   └─────────────────────────────────────┘
 */
export function renderFacebookPost(block: Block): string {
  const props = getProps<FacebookPostProps>(block);
  const timeAgo = props.timeAgo ?? '2h';

  // WHY: Winners (SmoothSpire) use 45x45 avatars with border-radius 4px (not 50% circle).
  //      Uses randomuser.me for deterministic face photos based on author name.
  const avatarUrl = props.authorAvatar || getRandomAvatar(props.authorName);
  const avatarHtml = `<img src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(props.authorName)}" style="width:45px;height:45px;border-radius:4px;object-fit:cover;flex-shrink:0;">`;

  const imageHtml = props.imageUrl
    ? `<div style="margin-top:8px;border-radius:8px;overflow:hidden;"><img src="${escapeHtml(props.imageUrl)}" alt="Post image" style="width:100%;display:block;" loading="lazy"></div>`
    : '';

  // WHY: Format counts: 142 likes, 23 comments, 5 shares
  const likes = props.likes ?? 0;
  const comments = props.comments ?? 0;

  // WHY: Winners use "Like · Reply · [thumb-icon] 4 · 39 min" — flat action bar, not Facebook-style stats
  const thumbsUpSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#3578E5" stroke="#3578E5" stroke-width="1"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>`;
  const statsHtml = `<ul style="display:flex;align-items:center;padding:0;margin:0;list-style:none;border-top:1px solid #E5E7EB;padding-top:8px;margin-top:8px;">
    <li style="color:#7f7f7f;font-size:14px;font-weight:400;padding-right:7px;list-style:none;">Like ·</li>
    <li style="color:#7f7f7f;font-size:14px;font-weight:400;padding-right:7px;list-style:none;">Reply ·</li>
    <li style="display:flex;align-items:center;gap:3px;color:#3578E5;font-weight:600;font-size:14px;list-style:none;padding-right:7px;">${thumbsUpSvg} ${likes > 0 ? likes : ''}</li>
    <li style="color:#7f7f7f;font-size:14px;font-weight:400;list-style:none;">${escapeHtml(timeAgo)}</li>
  </ul>`;

  // WHY: Winners indent replies 60px with full avatar — not initial letter circle
  const topCommentHtml = props.topComment
    ? `<div style="display:flex;gap:10px;padding-top:10px;padding-left:55px;margin-top:4px;border-top:1px solid #E5E7EB;">
        <img src="${escapeHtml(getRandomAvatar(props.topCommentAuthor ?? 'reply'))}" alt="" style="width:40px;height:40px;border-radius:4px;object-fit:cover;flex-shrink:0;">
        <div>
          <div style="font-family:'Inter','Montserrat',sans-serif;font-size:14px;font-weight:700;color:#365899;margin:0;">${escapeHtml(props.topCommentAuthor ?? '')}</div>
          <div style="font-family:'Inter',sans-serif;font-size:14px;line-height:14px;color:#303030;margin:4px 0 0;">${escapeHtml(props.topComment)}</div>
          <ul style="display:flex;align-items:center;padding:0;margin:4px 0 0;list-style:none;">
            <li style="color:#7f7f7f;font-size:14px;padding-right:7px;">Like ·</li>
            <li style="color:#7f7f7f;font-size:14px;padding-right:7px;">Reply ·</li>
            <li style="display:flex;align-items:center;gap:3px;color:#3578E5;font-weight:600;font-size:14px;">${thumbsUpSvg} 4</li>
          </ul>
        </div>
      </div>`
    : '';

  // WHY: Author name in #365899 blue (Facebook blue), avatar 45x45px, Montserrat font
  //      — matches SmoothSpire winner Facebook comments exactly
  const content = `
    <div style="background:#fff;padding:0;">
      <div style="display:flex;align-items:flex-start;gap:10px;">
        ${avatarHtml}
        <div>
          <h3 style="font-family:'Inter','Montserrat',sans-serif;font-size:14px;line-height:14px;font-weight:700;color:#365899;margin:0;">${escapeHtml(props.authorName)}</h3>
          <p style="font-size:14px;line-height:14px;color:#303030;margin:4px 0 10px;">${escapeHtml(props.text)}</p>
          ${imageHtml}
          ${statsHtml}
        </div>
      </div>
      ${topCommentHtml}
    </div>
  `;

  const visClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  return `${responsiveStyles}${wrapSection(content, {
    id: block.id,
    blockClass: cn('ec-facebook-post', visClass),
  })}`;
}

// ─── 4. Doctor Endorsement ─────────────────────────────────────────────────────

interface DoctorEndorsementProps {
  doctorName: string;
  credentials?: string;
  photoUrl?: string;
  /** WHY: AI sometimes sends "imageSrc" or empty photoUrl */
  imageSrc?: string;
  quote?: string;
  /** WHY: AI sends "text" instead of "quote" — accept both */
  text?: string;
  specialty?: string;
  institution?: string;
}

/**
 * WHY: Vibriance, Rejuvera, SmoothSpire winners show doctor/expert endorsements.
 *      Pattern: Professional headshot, name, credentials (MD, PhD, PT), specialty,
 *      institution, and a quote endorsing the product or approach.
 *      Positioned mid-article for maximum trust before CTA.
 *
 * Visual structure:
 *   ┌────────────────────────────────────────┐
 *   │  "Quote about why this works..."       │
 *   │                                        │
 *   │  [Photo] Dr. Name, MD                  │
 *   │          Specialty                      │
 *   │          Institution                    │
 *   └────────────────────────────────────────┘
 */
export function renderDoctorEndorsement(block: Block): string {
  const props = getProps<DoctorEndorsementProps>(block);

  // WHY: AI sends "text" or "quote" — accept both
  const quoteText = props.quote || props.text || '';

  // WHY: Professional photo with green border accent — trust signal.
  //      Uses random doctor avatar when no photoUrl provided.
  const photoUrl = props.photoUrl || props.imageSrc || getRandomDoctorAvatar(props.doctorName);
  const photoHtml = `<img src="${escapeHtml(photoUrl)}" alt="${escapeHtml(props.doctorName)}" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:3px solid #2D6A4F;flex-shrink:0;">`;

  const credText = props.credentials ? `, ${props.credentials}` : '';
  const specialtyHtml = props.specialty
    ? `<div style="font-family:'Inter',sans-serif;font-size:13px;color:#2D6A4F;font-weight:500;margin-top:2px;">${escapeHtml(props.specialty)}</div>`
    : '';
  const institutionHtml = props.institution
    ? `<div style="font-family:'Inter',sans-serif;font-size:12px;color:#6B7280;margin-top:1px;">${escapeHtml(props.institution)}</div>`
    : '';

  // WHY: Light green card with left border accent — matches editorial callout pattern
  const content = `
    <div style="background:linear-gradient(135deg,rgba(45,106,79,0.04) 0%,rgba(45,106,79,0.01) 100%);border:1px solid rgba(45,106,79,0.15);border-left:4px solid #2D6A4F;border-radius:8px;padding:20px;">
      <div style="font-family:'Open Sans',sans-serif;font-size:17px;line-height:1.6;color:#1B1B1B;margin-bottom:16px;font-style:italic;">
        "${escapeHtml(quoteText)}"
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        ${photoHtml}
        <div>
          <div style="font-family:'Inter',sans-serif;font-size:15px;font-weight:700;color:#1B1B1B;">
            ${escapeHtml(props.doctorName)}<span style="font-weight:400;color:#6B7280;">${escapeHtml(credText)}</span>
          </div>
          ${specialtyHtml}
          ${institutionHtml}
        </div>
      </div>
    </div>
  `;

  const visClass = buildVisibilityClass(block.visibility);
  const responsiveStyles = buildResponsiveStyles(block.id, block.styles);

  return `${responsiveStyles}${wrapSection(content, {
    id: block.id,
    blockClass: cn('ec-doctor-endorsement', visClass),
  })}`;
}
