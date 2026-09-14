const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5514982308886';

type WhatsAppProduct = {
  name: string;
  brand?: string;
};

export function getWhatsAppLink(product?: WhatsAppProduct) {
  const message = product
    ? `Olá! Vi o produto ${product.name}${
        product.brand ? ` da ${product.brand}` : ''
      } no catálogo da Ótica Dumas e gostaria de saber mais informações.`
    : 'Olá! Gostaria de falar com a Ótica Dumas.';

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message,
  )}`;
}