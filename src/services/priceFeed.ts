let cachedPrice: number | null = null;
let lastFetch = 0;
const CACHE_TTL = 60_000;

export async function fetchKaspaPrice(): Promise<number | null> {
  if (cachedPrice && Date.now() - lastFetch < CACHE_TTL) return cachedPrice;
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=kaspa&vs_currencies=usd',
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return cachedPrice;
    const data = await res.json();
    cachedPrice = data?.kaspa?.usd ?? null;
    lastFetch = Date.now();
    return cachedPrice;
  } catch {
    return cachedPrice;
  }
}
