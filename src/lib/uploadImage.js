// lib/uploadImage.js

import axios from "axios";

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post("/api/uploads/images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const collectImagesFromJSON = (json) => {
  const images = [];

  const walk = (node) => {
    if (!node) return;

    if (node.type === "image" && node.attrs?.src) {
      images.push({
        secure_url: node.attrs.src,
      });
    }

    if (node.content) {
      node.content.forEach(walk);
    }
  };

  walk(json);
  return images;
};
