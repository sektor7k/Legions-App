// TiptapEditor.tsx
"use client";

import { FC, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { Bold, Italic, UnderlineIcon, Highlighter, LinkIcon, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

// Eğer CustomLink kullanmak isterseniz
const CustomLink = Link.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: "custom-link",
      },
    }
  },
});

interface TiptapEditorProps {
  initialContent?: string;
  onUpdateContent?: (html: string) => void;
}

const TiptapEditor: FC<TiptapEditorProps> = ({
  initialContent = "<p>Merhaba, buraya yazmaya başlayın...</p>",
  onUpdateContent,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
      }),
      Highlight,
      Underline,
      CustomLink.configure({
        openOnClick: false,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
    },
    onUpdate({ editor }) {
      if (onUpdateContent) {
        onUpdateContent(editor.getHTML());
      }
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("URL girin:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addEmoji = (emoji: { native: string }) => {
    editor.chain().focus().insertContent(emoji.native).run();
    setShowEmojiPicker(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4 flex flex-wrap gap-2">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-primary/20 border border-primary" : ""}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-primary/20 border border-primary" : ""}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "bg-primary/20 border border-primary" : ""}
        >
          <UnderlineIcon className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={editor.isActive("highlight") ? "bg-primary/20 border border-primary" : ""}
        >
          <Highlighter className="w-4 h-4" />
        </Button>
        <Button onClick={addLink}>
          <LinkIcon className="w-4 h-4" />
        </Button>
        <Button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <Smile className="w-4 h-4" />
        </Button>
      </div>
      {showEmojiPicker && (
        <div className="mb-4">
          <Picker data={data} onEmojiSelect={addEmoji} />
        </div>
      )}
      <EditorContent
        editor={editor}
        className="border rounded-md p-4 min-h-[400px] max-h-[600px] overflow-y-auto w-full"
      />
    </div>
  );
};

export default TiptapEditor;
