"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const TiptapEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border p-2 rounded" style={{ minHeight: "200px", marginBottom: "50px" }}>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
