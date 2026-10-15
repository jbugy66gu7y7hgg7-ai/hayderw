/**
 * Generates the absolute verification URL for a given certificate number.
 * Ensures the URL is openable from any device (smartphones, external computers)
 * as well as inside the AI Studio environment.
 */
export function getCertificateVerifyUrl(certNumber: string): string {
  const cleanCert = encodeURIComponent(String(certNumber).trim());

  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    const hostname = window.location.hostname;

    // If running inside local machine without a public host
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      // In dev environment, point to the publicly resolvable AI Studio URL
      return `https://ais-dev-bf4ar2aippcmzp7n2v2dw4-826928946788.europe-west2.run.app/verify/${cleanCert}`;
    }

    // In preview / production / custom domain (e.g. ais-pre or alofuk.com)
    return `${origin}/verify/${cleanCert}`;
  }

  // Fallback for SSR or non-browser environments
  return `https://ais-dev-bf4ar2aippcmzp7n2v2dw4-826928946788.europe-west2.run.app/verify/${cleanCert}`;
}
