import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export function getPublicIdFromCloudinaryUrl(url) {
  if (!url) return null;

  // buang query string
  const cleanUrl = url.split("?")[0];

  // ambil setelah /upload/
  const afterUpload = cleanUrl.split("/upload/")[1];
  if (!afterUpload) return null;

  // buang versi (v123456)
  const withoutVersion = afterUpload.replace(/^v\d+\//, "");

  // buang ekstensi
  const publicId = withoutVersion.replace(/\.[^/.]+$/, "");

  return publicId;
}
