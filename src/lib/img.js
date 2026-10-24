// Makes Cloudinary images small and fast (auto format + width). Other URLs are unchanged.
export const img = (url, w = 800) =>
  url && url.includes('res.cloudinary.com') && url.includes('/upload/')
    ? url.replace('/upload/', `/upload/f_auto,q_auto,w_${w}/`)
    : url;
