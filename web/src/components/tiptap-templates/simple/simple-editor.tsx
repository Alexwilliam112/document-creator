import * as React from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Underline } from "@tiptap/extension-underline";

// --- Custom Extensions ---
import { Link } from "@/components/tiptap-extension/link-extension";
import { Selection } from "@/components/tiptap-extension/selection-extension";
import { TrailingNode } from "@/components/tiptap-extension/trailing-node-extension";

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button";
import { Spacer } from "@/components/tiptap-ui-primitive/spacer";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { NodeButton } from "@/components/tiptap-ui/node-button";
import {
  HighlightPopover,
  HighlightContent,
  HighlighterButton,
} from "@/components/tiptap-ui/highlight-popover";
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon";
import { LinkIcon } from "@/components/tiptap-icons/link-icon";

// --- Hooks ---
import { useMobile } from "@/hooks/use-mobile";
import { useWindowSize } from "@/hooks/use-window-size";

// --- Components ---
import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";

import content from "@/components/tiptap-templates/simple/data/content.json";

const MainToolbarContent = ({
  editor,
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  editor: any;
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <Button
          onClick={() =>
            editor?.chain().focus().insertTable({ rows: 3, cols: 3 }).run()
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              fill="none"
              stroke="white"
              stroke-width="0.5"
            />
            <line
              x1="3"
              y1="9"
              x2="21"
              y2="9"
              stroke="white"
              stroke-width="0.5"
            />
            <line
              x1="3"
              y1="15"
              x2="21"
              y2="15"
              stroke="white"
              stroke-width="0.5"
            />
            <line
              x1="9"
              y1="3"
              x2="9"
              y2="21"
              stroke="white"
              stroke-width="0.5"
            />
            <line
              x1="15"
              y1="3"
              x2="15"
              y2="21"
              stroke="white"
              stroke-width="0.5"
            />
            <rect
              x="2"
              y="2"
              width="20"
              height="20"
              fill="none"
              stroke="white"
              stroke-width="0.5"
            />
          </svg>
        </Button>
        <Button onClick={() => editor?.chain().focus().deleteTable().run()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              fill="none"
              stroke="white"
              stroke-width="0.5"
            />
            <line
              x1="3"
              y1="3"
              x2="21"
              y2="21"
              stroke="white"
              stroke-width="0.5"
            />
            <line
              x1="21"
              y1="3"
              x2="3"
              y2="21"
              stroke="white"
              stroke-width="0.5"
            />
          </svg>
        </Button>
        <Button onClick={() => editor?.chain().focus().addRowAfter().run()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              fill="none"
              stroke="white"
              stroke-width="0.5"
            />
            <line
              x1="3"
              y1="9"
              x2="21"
              y2="9"
              stroke="white"
              stroke-width="0.5"
            />
            <line
              x1="3"
              y1="15"
              x2="21"
              y2="15"
              stroke="white"
              stroke-width="0.5"
            />
            <line
              x1="12"
              y1="15"
              x2="12"
              y2="21"
              stroke="green"
              stroke-width="2"
            />
            <line
              x1="9"
              y1="18"
              x2="15"
              y2="18"
              stroke="green"
              stroke-width="2"
            />
          </svg>
        </Button>
        <Button onClick={() => editor?.chain().focus().deleteRow().run()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              fill="none"
              stroke="white"
              stroke-width="0.5"
            />
            <line
              x1="3"
              y1="9"
              x2="21"
              y2="9"
              stroke="white"
              stroke-width="0.5"
            />
            <line
              x1="3"
              y1="15"
              x2="21"
              y2="15"
              stroke="white"
              stroke-width="0.5"
            />
            <line
              x1="9"
              y1="18"
              x2="15"
              y2="18"
              stroke="red"
              stroke-width="2"
            />
          </svg>
        </Button>
        <Button onClick={() => editor?.chain().focus().addColumnAfter().run()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              fill="none"
              stroke="white"
              stroke-width="0.5"
            />
            <line
              x1="9"
              y1="3"
              x2="9"
              y2="21"
              stroke="white"
              stroke-width="0.5"
            />
            <line
              x1="15"
              y1="3"
              x2="15"
              y2="21"
              stroke="white"
              stroke-width="0.5"
            />
            <line
              x1="15"
              y1="12"
              x2="21"
              y2="12"
              stroke="green"
              stroke-width="2"
            />
            <line
              x1="18"
              y1="9"
              x2="18"
              y2="15"
              stroke="green"
              stroke-width="2"
            />
          </svg>
        </Button>
        <Button onClick={() => editor?.chain().focus().deleteColumn().run()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              fill="none"
              stroke="white"
              stroke-width="0.5"
            />
            <line
              x1="9"
              y1="3"
              x2="9"
              y2="21"
              stroke="white"
              stroke-width="0.5"
            />
            <line
              x1="15"
              y1="3"
              x2="15"
              y2="21"
              stroke="white"
              stroke-width="0.5"
            />
            <line
              x1="18"
              y1="9"
              x2="18"
              y2="15"
              stroke="red"
              stroke-width="2"
            />
          </svg>
        </Button>
      </ToolbarGroup>

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
        <ListDropdownMenu types={["bulletList", "orderedList", "taskList"]} />
        <NodeButton type="codeBlock" />
        <NodeButton type="blockquote" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <HighlightPopover />
        ) : (
          <HighlighterButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup>
    </>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link";
  onBack: () => void;
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? <HighlightContent /> : <LinkContent />}
  </>
);

export function SimpleEditor() {
  const isMobile = useMobile();
  const windowSize = useWindowSize();
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main");
  const [rect, setRect] = React.useState({ y: 0 });

  React.useEffect(() => {
    setRect(document.body.getBoundingClientRect());
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
      },
    },
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,

      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
      TrailingNode,
      Link.configure({ openOnClick: false }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: content,
  });

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  return (
    <EditorContext.Provider value={{ editor }}>
      <Toolbar
        style={
          isMobile
            ? {
                bottom: `calc(100% - ${windowSize.height - rect.y}px)`,
              }
            : {}
        }
      >
        {mobileView === "main" ? (
          <MainToolbarContent
            editor={editor}
            onHighlighterClick={() => setMobileView("highlighter")}
            onLinkClick={() => setMobileView("link")}
            isMobile={isMobile}
          />
        ) : (
          <MobileToolbarContent
            type={mobileView === "highlighter" ? "highlighter" : "link"}
            onBack={() => setMobileView("main")}
          />
        )}
      </Toolbar>

      <div className="content-wrapper">
        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </div>
    </EditorContext.Provider>
  );
}
