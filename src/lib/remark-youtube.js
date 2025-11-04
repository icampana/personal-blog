import { visit } from 'unist-util-visit';

/**
 * Remark plugin to embed YouTube videos in markdown
 *
 * Supports multiple formats:
 * 1. Standalone YouTube URLs (automatically converted to embeds):
 *    - https://www.youtube.com/watch?v=VIDEO_ID
 *    - https://youtu.be/VIDEO_ID
 *    - https://www.youtube.com/embed/VIDEO_ID
 *
 * 2. Custom directive syntax:
 *    - ::youtube[VIDEO_ID]
 *    - ::youtube{v=VIDEO_ID}
 *    - ::youtube{v=VIDEO_ID title="Custom Title"}
 */
export default function remarkYoutube() {
  return function transformer(tree) {
    // Process text and link nodes for standalone YouTube URLs
    visit(tree, ['text', 'link', 'paragraph'], (node, index, parent) => {
      // Handle paragraph nodes that contain only a YouTube link
      if (node.type === 'paragraph' && node.children?.length === 1) {
        const child = node.children[0];
        if (child.type === 'link' || child.type === 'text') {
          const url = child.type === 'link' ? child.url : child.value;
          const videoId = extractYouTubeId(url);

          if (videoId && parent && typeof index === 'number') {
            parent.children[index] = createYouTubeEmbed(videoId);
            return;
          }
        }
      }

      // Handle standalone link nodes
      if (node.type === 'link') {
        const videoId = extractYouTubeId(node.url);
        if (videoId && parent && typeof index === 'number') {
          parent.children[index] = createYouTubeEmbed(videoId);
        }
      }
    });

    // Process custom directive syntax ::youtube[VIDEO_ID] or ::youtube{v=VIDEO_ID}
    visit(
      tree,
      ['textDirective', 'leafDirective', 'containerDirective'],
      (node, index, parent) => {
        if (node.name !== 'youtube') return;

        let videoId = null;
        let title = 'YouTube video player';

        // Handle ::youtube[VIDEO_ID] format
        if (node.children?.[0]?.value) {
          videoId = node.children[0].value.trim();
        }

        // Handle ::youtube{v=VIDEO_ID} format
        if (node.attributes?.v) {
          videoId = node.attributes.v;
        }

        // Get custom title if provided
        if (node.attributes?.title) {
          title = node.attributes.title;
        }

        if (videoId && parent && typeof index === 'number') {
          parent.children[index] = createYouTubeEmbed(videoId, title);
        }
      },
    );

    return tree;
  };
}

/**
 * Extract YouTube video ID from various URL formats
 * @param {string} url - The URL to extract from
 * @returns {string|null} - The video ID or null if not found
 */
function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;

  // Regular YouTube URLs: https://www.youtube.com/watch?v=VIDEO_ID
  const standardMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*&v=)([a-zA-Z0-9_-]{11})/,
  );
  if (standardMatch) return standardMatch[1];

  // Short URLs: https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // Embed URLs: https://www.youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  // If it looks like a plain video ID (11 characters, alphanumeric with - and _)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
    return url.trim();
  }

  return null;
}

/**
 * Create a YouTube embed HTML node
 * @param {string} videoId - The YouTube video ID
 * @param {string} title - The iframe title for accessibility
 * @returns {object} - The HTML node for the embed
 */
function createYouTubeEmbed(videoId, title = 'YouTube video player') {
  return {
    type: 'html',
    value: `<div class="youtube-embed" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 2rem 0;">
  <iframe
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    src="https://www.youtube-nocookie.com/embed/${videoId}"
    title="${escapeHtml(title)}"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
    loading="lazy">
  </iframe>
</div>`,
  };
}

/**
 * Escape HTML special characters
 * @param {string} str - The string to escape
 * @returns {string} - The escaped string
 */
function escapeHtml(str) {
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}
