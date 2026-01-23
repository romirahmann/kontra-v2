"use client";
import { imageFileStore } from "@/services/imageStore.service";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaQuoteRight,
  FaAlignLeft,
  FaAlignCenter,
  FaUndo,
  FaRedo,
  FaLink,
  FaImage,
  FaTable,
} from "react-icons/fa";

export default function TiptapToolbar({ editor }) {
  if (!editor) return null;

  const btn = (active = false, disabled = false) =>
    `p-2 rounded text-sm transition ${
      active ? "bg-blue-600 text-white" : "hover:bg-gray-200"
    } ${disabled ? "opacity-40 pointer-events-none" : ""}`;
  const group = "flex items-center gap-1 border-r pr-2 mr-2";

  const setLink = () => {
    const prev = editor.getAttributes("link").href;
    const url = prompt("Masukkan URL:", prev || "");
    if (url === null) return;
    if (!url) editor.chain().focus().unsetLink().run();
    else
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
  };

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      const localUrl = URL.createObjectURL(file);
      const localId = crypto.randomUUID();

      imageFileStore.set(localId, file);

      editor
        .chain()
        .focus()
        .setImage({
          src: localUrl,
          "data-local": "true",
          "data-local-id": localId,
        })
        .run();
    };

    input.click();
  };

  return (
    <div className="flex flex-wrap items-center px-3 py-2 border-b bg-gray-100 sticky top-0 z-10">
      <div className={group}>
        <button
          className={btn(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <FaBold />
        </button>
        <button
          className={btn(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FaItalic />
        </button>
        <button
          className={btn(editor.isActive("underline"))}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <FaUnderline />
        </button>
      </div>

      <div className={group}>
        {[2, 3, 4].map((lvl) => (
          <button
            key={lvl}
            className={btn(editor.isActive("heading", { level: lvl }))}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: lvl }).run()
            }
          >
            H{lvl}
          </button>
        ))}
      </div>

      <div className={group}>
        <button
          className={btn()}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <FaAlignLeft />
        </button>
        <button
          className={btn()}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <FaAlignCenter />
        </button>
      </div>

      <div className={group}>
        <button
          className={btn()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FaListUl />
        </button>
        <button
          className={btn()}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <FaListOl />
        </button>
        <button
          className={btn()}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <FaQuoteRight />
        </button>
      </div>

      <div className={group}>
        <button className={btn(editor.isActive("link"))} onClick={setLink}>
          <FaLink />
        </button>
        <button className={btn()} onClick={addImage}>
          <FaImage />
        </button>
        <button
          className={btn()}
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          <FaTable />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button
          className={btn()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <FaUndo />
        </button>
        <button
          className={btn()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <FaRedo />
        </button>
      </div>
    </div>
  );
}
