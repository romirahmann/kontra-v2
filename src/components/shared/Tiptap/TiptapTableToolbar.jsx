import {
  FaTable,
  FaPlus,
  FaTrash,
  FaColumns,
  FaGripLines,
  FaCompress,
  FaExpand,
} from "react-icons/fa";
export default function TiptapTableToolbar({ editor }) {
  if (!editor) return null;

  const isTableActive = editor.isActive("table");
  if (!isTableActive) return null;

  const btn = (disabled = false) =>
    `px-2 py-1 rounded text-xs border bg-white hover:bg-gray-100 transition
     ${disabled ? "opacity-40 pointer-events-none" : ""}`;

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 sticky top-[52px] z-10">
      {/* ROW */}
      <button
        className={btn(!editor.can().addRowAfter())}
        onClick={() => editor.chain().focus().addRowAfter().run()}
      >
        <FaPlus /> Row
      </button>

      <button
        className={btn(!editor.can().deleteRow())}
        onClick={() => editor.chain().focus().deleteRow().run()}
      >
        <FaTrash /> Row
      </button>

      {/* COLUMN */}
      <button
        className={btn(!editor.can().addColumnAfter())}
        onClick={() => editor.chain().focus().addColumnAfter().run()}
      >
        <FaColumns /> Col
      </button>

      <button
        className={btn(!editor.can().deleteColumn())}
        onClick={() => editor.chain().focus().deleteColumn().run()}
      >
        <FaTrash /> Col
      </button>

      {/* HEADER */}
      <button
        className={btn()}
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
      >
        <FaGripLines /> Header
      </button>

      {/* MERGE / SPLIT */}
      <button
        className={btn(!editor.can().mergeCells())}
        onClick={() => editor.chain().focus().mergeCells().run()}
      >
        <FaCompress /> Merge
      </button>

      <button
        className={btn(!editor.can().splitCell())}
        onClick={() => editor.chain().focus().splitCell().run()}
      >
        <FaExpand /> Split
      </button>

      {/* DELETE TABLE */}
      <button
        className={btn(!editor.can().deleteTable())}
        onClick={() => editor.chain().focus().deleteTable().run()}
      >
        <FaTrash /> Table
      </button>
    </div>
  );
}
