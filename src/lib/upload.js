import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

// Uses Cloudinary (free tier) if configured, otherwise Firebase Storage.
export async function uploadImage(file, folder = 'misc') {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Image must be under 5 MB.');

  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  if (cloud) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Image upload failed. Check your Cloudinary settings.');
    return (await res.json()).secure_url;
  }

  const r = ref(storage, `${folder}/${Date.now()}-${file.name}`);
  await uploadBytes(r, file);
  return getDownloadURL(r);
}
