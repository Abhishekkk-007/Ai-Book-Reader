/**
 * Split text into sentences for TTS
 */
export function splitIntoSentences(text) {
  if (!text) return [];
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 2);
}

/**
 * Detect if a sentence is a dialogue (contains quoted text)
 */
export function isDialogue(sentence) {
  return /["""'''][^"""''']{4,}["""''']/.test(sentence);
}

/**
 * Extract plain text segments and tag each as narrator or dialogue
 */
export function tagSegments(text) {
  const sentences = splitIntoSentences(text);
  return sentences.map((s) => ({
    text: s,
    type: isDialogue(s) ? 'dialogue' : 'narrator',
  }));
}

/**
 * Truncate text to a max length with ellipsis
 */
export function truncate(text, max = 80) {
  if (!text) return '';
  return text.length > max ? text.slice(0, max) + '…' : text;
}

/**
 * Format file size in human-readable form
 */
export function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Format date relative to now
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}