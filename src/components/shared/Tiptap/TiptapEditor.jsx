"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useRef } from "react";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";

import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

import CustomImage from "@/services/imageStore.service";
import TiptapToolbar from "./TiptapToolbar";
import TiptapTableToolbar from "./TiptapTableToolbar";

export default function TiptapEditor({ value, onChange }) {
  const isInitialContentSet = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        heading: false,
        history: true,
      }),
      Heading.configure({ levels: [2, 3, 4] }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph", "listItem"],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      CustomImage.configure({
        inline: false,
        allowBase64: false,
      }),
      Placeholder.configure({
        placeholder: "Tulis berita di sini...",
      }),
      Table.configure({
        resizable: true,
        lastColumnResizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],

    /**
     * ⚠️ JANGAN setContent di sini
     * cukup kirim hasil ke parent
     */
    onUpdate: ({ editor }) => {
      onChange?.({
        json: editor.getJSON(),
        html: editor.getHTML(),
      });
    },
  });

  /**
   * ✅ SET CONTENT HANYA SEKALI
   * (initial load / edit article)
   */
  useEffect(() => {
    if (!editor) return;

    if (value?.json && !isInitialContentSet.current) {
      editor.commands.setContent(value.json, false);
      isInitialContentSet.current = true;
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <TiptapToolbar editor={editor} />
      <TiptapTableToolbar editor={editor} />

      <EditorContent
        editor={editor}
        className="
          prose max-w-none min-h-[420px] p-4
          focus:outline-none
          prose-img:rounded-xl
          prose-table:border
        "
      />
    </div>
  );
}
