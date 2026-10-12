/**
 * Resolution utility for user's original WhatsApp photographs
 */

export const WHATSAPP_PHOTO_NAMES: Record<string, string> = {
  mem_1: 'WhatsApp Image 2026-10-07 at 7.32.01 PM.jpeg',
  mem_2: 'WhatsApp Image 2026-09-18 at 4.40.44 PM.jpeg',
  mem_3: 'WhatsApp Image 2026-10-08 at 11.44.18 PM.jpeg',
  mem_4: 'WhatsApp Image 2026-09-21 at 2.49.27 PM.jpeg',
};

/**
 * Normalizes user-entered or configured image paths:
 * - Preserves data URLs (base64) and blob URLs from in-app file picker
 * - Handles Windows paths (e.g. "C:\Users\DARY\Downloads\WhatsApp Image...")
 * - Strips accidental '/public/' or 'public/' prefix
 * - Prepend Vite base URL
 */
export function normalizePhotoUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Data URLs (from in-app photo picker) or blob / external URLs
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // If a local Windows path was passed (e.g. "C:\Users\...\WhatsApp Image...")
  let cleanPath = trimmed.replace(/^["']|["']$/g, '');
  if (/^[a-zA-Z]:[\\\/]/.test(cleanPath) || cleanPath.includes('\\')) {
    const fileName = cleanPath.split(/[\\\/]/).pop();
    if (fileName) {
      cleanPath = `/photos/${fileName}`;
    }
  }

  // Strip leading '/public/' or 'public/'
  if (cleanPath.startsWith('/public/')) {
    cleanPath = cleanPath.slice(7); // becomes '/photos/...'
  } else if (cleanPath.startsWith('public/')) {
    cleanPath = '/' + cleanPath.slice(7);
  }

  // Remove leading './'
  if (cleanPath.startsWith('./')) {
    cleanPath = '/' + cleanPath.slice(2);
  }

  // Ensure leading slash
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }

  const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  return `${baseUrl}${cleanPath}`;
}

/**
 * Returns candidate URLs for a memory card strictly based on the user's original photograph.
 * Handles space encoding (%20) and common extension matching (.jpeg / .jpg).
 * Absolutely NO fake replacement photos (no coffee shops, no random mountains).
 */
export function getPhotoCandidateUrls(memoryId: string, index: number, userUrl?: string): string[] {
  const candidates: string[] = [];
  const memoryNum = index + 1;
  const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

  // 1. If user provided a data: or blob: URL via the in-app photo uploader
  if (userUrl && (userUrl.startsWith('data:') || userUrl.startsWith('blob:'))) {
    return [userUrl];
  }

  // 2. Identify the target filename from userUrl or from the WhatsApp memory mapping
  const officialWaName = WHATSAPP_PHOTO_NAMES[memoryId] || WHATSAPP_PHOTO_NAMES[`mem_${memoryNum}`];
  
  let targetPath = '';
  if (userUrl && userUrl.trim()) {
    targetPath = normalizePhotoUrl(userUrl);
  } else if (officialWaName) {
    targetPath = `${baseUrl}/photos/${officialWaName}`;
  }

  if (targetPath) {
    // URL with percent-encoded spaces for web servers like Netlify
    const encoded = encodeURI(targetPath);
    if (!candidates.includes(encoded)) {
      candidates.push(encoded);
    }

    // Raw path with spaces
    if (!candidates.includes(targetPath)) {
      candidates.push(targetPath);
    }

    // If extension is .jpeg, also check .jpg (and vice-versa) in case user saved with .jpg
    if (/\.jpeg$/i.test(targetPath)) {
      const altJpg = targetPath.replace(/\.jpeg$/i, '.jpg');
      const altJpgEnc = encodeURI(altJpg);
      if (!candidates.includes(altJpgEnc)) candidates.push(altJpgEnc);
      if (!candidates.includes(altJpg)) candidates.push(altJpg);
    } else if (/\.jpg$/i.test(targetPath)) {
      const altJpeg = targetPath.replace(/\.jpg$/i, '.jpeg');
      const altJpegEnc = encodeURI(altJpeg);
      if (!candidates.includes(altJpegEnc)) candidates.push(altJpegEnc);
      if (!candidates.includes(altJpeg)) candidates.push(altJpeg);
    }
  }

  // Also ensure the official WhatsApp filename is in the candidate list if userUrl differed
  if (officialWaName) {
    const waPath = `${baseUrl}/photos/${officialWaName}`;
    const waEnc = encodeURI(waPath);
    if (!candidates.includes(waEnc)) candidates.push(waEnc);
    if (!candidates.includes(waPath)) candidates.push(waPath);

    const waAltJpg = waPath.replace(/\.jpeg$/i, '.jpg');
    const waAltJpgEnc = encodeURI(waAltJpg);
    if (!candidates.includes(waAltJpgEnc)) candidates.push(waAltJpgEnc);
    if (!candidates.includes(waAltJpg)) candidates.push(waAltJpg);
  }

  return candidates;
}
