// components/ui/tiptap/CustomImage.js
import { uploadImageToCloudinary } from "@/lib/uploadImage";
import Image from "@tiptap/extension-image";
import axios from "axios";

const CustomImage = Image.extend({
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: null },
      height: { default: null },

      "data-local": {
        default: null,
        parseHTML: (element) => element.getAttribute("data-local"),
        renderHTML: (attrs) =>
          attrs["data-local"] ? { "data-local": attrs["data-local"] } : {},
      },

      "data-local-id": {
        default: null,
        parseHTML: (element) => element.getAttribute("data-local-id"),
        renderHTML: (attrs) =>
          attrs["data-local-id"]
            ? { "data-local-id": attrs["data-local-id"] }
            : {},
      },
    };
  },
});

export default CustomImage;

export const imageFileStore = new Map();

export const uploadLocalImages = async (content) => {
  const uploadedImages = [];
  const clonedJson = structuredClone(content.json);

  const walk = async (nodes) => {
    for (const node of nodes) {
      if (node.type === "image" && node.attrs?.["data-local-id"]) {
        const localId = node.attrs["data-local-id"];
        const file = imageFileStore.get(localId);
        if (!file) continue;

        const res = await uploadImageToCloudinary(file);
        if (!res?.secure_url) {
          throw new Error("Upload image gagal");
        }

        // ✅ UPDATE CLONE
        node.attrs.src = res.secure_url;
        delete node.attrs["data-local"];
        delete node.attrs["data-local-id"];

        uploadedImages.push({
          url: res.secure_url,
          public_id: res.public_id,
          type: "image",
        });
      }

      if (node.content) await walk(node.content);
    }
  };

  await walk(clonedJson.content || []);
  imageFileStore.clear();

  return {
    json: clonedJson,
    images: uploadedImages,
  };
};

export const hasLocalImage = (json) => {
  let found = false;

  const walk = (node) => {
    if (!node || found) return;

    if (node.type === "image") {
      const src = node.attrs?.src || "";
      if (src.startsWith("data:") || src.startsWith("blob:")) {
        found = true;
        return;
      }
    }

    if (node.content) {
      node.content.forEach(walk);
    }
  };

  walk(json);
  return found;
};
