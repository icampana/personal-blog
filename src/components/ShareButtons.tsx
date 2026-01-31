import type React from 'react';
import { useEffect, useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({
  url,
  title,
  description = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  const shareData = {
    title,
    text: description,
    url,
  };

  useEffect(() => {
    setCanShare(
      typeof navigator !== 'undefined' && typeof navigator.share === 'function',
    );
  }, []);

  const handleNativeShare = async () => {
    if (canShare) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="mono text-xs font-medium text-base-content/70 uppercase tracking-wider mr-2">
        SHARE_
      </span>

      {/* Native share button (mobile) */}
      {canShare && (
        <button
          onClick={handleNativeShare}
          className="material-symbols-outlined text-base-content/70 hover:text-[var(--accent-neon)] cursor-pointer transition-colors text-lg"
          title="Share"
        >
          share
        </button>
      )}

      {/* Twitter */}
      <a
        href={shareUrls.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="material-symbols-outlined text-base-content/70 hover:text-[var(--accent-neon)] cursor-pointer transition-colors text-lg"
        title="Share on Twitter"
      >
        share
      </a>

      {/* Facebook */}
      <a
        href={shareUrls.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="material-symbols-outlined text-base-content/70 hover:text-[var(--accent-neon)] cursor-pointer transition-colors text-lg"
        title="Share on Facebook"
      >
        share
      </a>

      {/* LinkedIn */}
      <a
        href={shareUrls.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="material-symbols-outlined text-base-content/70 hover:text-[var(--accent-neon)] cursor-pointer transition-colors text-lg"
        title="Share on LinkedIn"
      >
        work
      </a>

      {/* WhatsApp */}
      <a
        href={shareUrls.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="material-symbols-outlined text-base-content/70 hover:text-[var(--accent-neon)] cursor-pointer transition-colors text-lg"
        title="Share on WhatsApp"
      >
        chat
      </a>

      {/* Copy link */}
      <button
        onClick={copyToClipboard}
        className="material-symbols-outlined text-base-content/70 hover:text-[var(--accent-neon)] cursor-pointer transition-colors text-lg"
        title={copied ? 'Link copied!' : 'Copy link'}
      >
        {copied ? 'check_circle' : 'content_copy'}
      </button>
    </div>
  );
};

export default ShareButtons;
