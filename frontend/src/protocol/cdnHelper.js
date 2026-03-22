// src/protocol/cdnHelper.js

/**
 * ASSET OPTIMIZATION PROTOCOL
 * Ensures heavy assets (Images/Lotties) are served via CDN 
 * to prevent server bandwidth exhaustion at 50k+ users.
 */
export const getOptimizedImage = (url, width = 400) => {
  if (!url) return null;
  
  // 1. Check if the asset is already on a high-speed CDN
  const isCdnHosted = url.includes('gstatic.com') || 
                      url.includes('lottiestellar.com') || 
                      url.includes('cdnjs.cloudflare.com');

  if (isCdnHosted) return url;

  // 2. Cloudinary-specific optimization (f_auto, q_auto)
  if (url.includes('cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);
  }

  // 3. Unsplash-specific optimization (auto=format for WebP/AVIF)
  if (url.includes('images.unsplash.com') && !url.includes('auto=format')) {
    return url + (url.includes('?') ? '&' : '?') + 'auto=format&q=80';
  }

  // 4. Fallback for local or unoptimized assets
  return url;
};