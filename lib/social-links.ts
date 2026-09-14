export const socialLinks = {
  instagram: 'https://www.instagram.com/otica.dumas/',
  facebook: 'https://www.facebook.com/otica.dumas/',
  threads: 'https://www.threads.com/@otica.dumas',
  whatsapp: 'https://wa.me/5514982308886',
} as const;

export function createWhatsAppLink(message: string) {
  return `${socialLinks.whatsapp}?text=${encodeURIComponent(message)}`;
}