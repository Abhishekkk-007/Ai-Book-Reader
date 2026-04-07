/**
 * Mock AI summary generator.
 * Replace generateSummary() body with a real API call (OpenAI, Claude, etc.) when ready.
 */

export function generateSummary(pageTexts) {
  if (!pageTexts || pageTexts.length === 0) {
    return 'No content available to summarize.';
  }

  const fullText = pageTexts.join(' ').replace(/\s+/g, ' ').trim();
  const sentences = fullText
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 20);

  if (sentences.length === 0) return 'No readable content found on these pages.';

  // Pick sentences evenly spaced for a "summary" effect
  const step = Math.max(1, Math.floor(sentences.length / 5));
  const picked = [];
  for (let i = 0; i < sentences.length && picked.length < 5; i += step) {
    picked.push(sentences[i].trim());
  }

  return picked.join(' ');
}

/**
 * Split pages into chapters heuristically:
 * A new chapter starts when a page's text begins with "Chapter" or a Roman numeral header.
 */
export function detectChapters(pageTexts) {
  const chapters = [];
  let current = null;

  pageTexts.forEach((text, idx) => {
    const trimmed = text.trim();
    const isChapterStart =
      /^(chapter\s+[\divxlc]+|prologue|epilogue|introduction|part\s+\d+)/i.test(trimmed);

    if (isChapterStart || !current) {
      if (current) chapters.push(current);
      const titleMatch = trimmed.match(/^([^\n.]{3,60})/);
      current = {
        title: titleMatch ? titleMatch[1].trim() : `Section ${chapters.length + 1}`,
        startPage: idx + 1,
        texts: [trimmed],
      };
    } else {
      current.texts.push(trimmed);
    }
  });

  if (current) chapters.push(current);
  return chapters;
}

/**
 * Generate per-chapter summaries
 */
export function generateChapterSummaries(pageTexts) {
  const chapters = detectChapters(pageTexts);
  return chapters.map((ch) => ({
    title: ch.title,
    startPage: ch.startPage,
    summary: generateSummary(ch.texts),
  }));
}