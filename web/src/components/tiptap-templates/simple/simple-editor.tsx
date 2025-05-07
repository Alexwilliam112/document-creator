import * as React from "react";
import { useEffect } from "react";
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  useEffect(() => {
    const fetchEditorContent = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const idDoc = queryParams.get("id_doc");

      if (!idDoc) {
        console.error("id_doc query parameter is missing.");
        return;
      }

      try {
        const response = await fetch(
          `https://api-oos.jojonomic.com/27054/mails/load-docs?id_doc=${idDoc}`
        );
        if (!response.ok) {
          console.error("Failed to fetch editor content.");
          return;
        }

        const data = await response.json();
        if (data.error) {
          console.error("Error in API response:", data.message);
          return;
        }

        const editorContent = data.data.content;
        editor?.commands.setContent(editorContent); // Set the editor content
      } catch (error) {
        console.error("Error fetching editor content:", error);
      }
    };

    fetchEditorContent();
  }, [editor]);

  

  const generatePDF = async () => {
    if (!editor) return;
  
    const editorElement = document.querySelector(
      ".simple-editor-content"
    ) as HTMLElement; // Explicitly cast to HTMLElement
    if (!editorElement) return;
  
    // Use html2canvas to capture the editor content as an image
    const canvas = await html2canvas(editorElement, {
      scale: 2, // Increase resolution
      useCORS: true, // Allow cross-origin images
      allowTaint: false, // Prevent tainted canvases
    });
  
    const imgData = canvas.toDataURL("image/png"); // Convert canvas to image data
    const pdf = new jsPDF("p", "mm", "a4"); // Create a new PDF
  
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Maintain aspect ratio
  
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight); // Add the styled content as an image
  
    // Parse the editor content to manually embed images
    const editorContent = editor.getHTML();
    const parser = new DOMParser();
    const doc = parser.parseFromString(editorContent, "text/html");
  
    const images = doc.querySelectorAll("img");
    let yOffset = pdfHeight + 10; // Start below the styled content
  
    for (const img of Array.from(images)) { // Fix applied here
      const imageUrl = img.src;
  
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const reader = new FileReader();
  
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
  
        img.src = base64;
      } catch (error) {
        console.error("Failed to convert image to Base64:", imageUrl, error);
      }
    }
  
    pdf.save("document.pdf"); // Save the PDF
  };

  //    const queryParams = new URLSearchParams(window.location.search);

  const saveData = async () => {
    if (!editor) return;

    // Get the editor content as HTML
    const editorContent = editor.getHTML();

    // Generate the PDF
    const editorElement = document.querySelector(
      ".simple-editor-content"
    ) as HTMLElement;
    if (!editorElement) return;

    const canvas = await html2canvas(editorElement, {
      scale: 1, // Reduce the scale to lower the resolution
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.7); // Use JPEG format with 70% quality
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST"); // Use "FAST" compression

    // Convert the PDF to a Base64 string
    const pdfBase64 = pdf.output("datauristring").split(",")[1]; // Remove the "data:application/pdf;base64," prefix

    // Upload the PDF to the file API
    try {
      const uploadResponse = await fetch(
        "https://gateway.jojonomic.com/v1/file",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzgxODMxNDgsImlhdCI6MTc0NjYyNTU0OCwiaXNzIjoiam9qb25vbWljLWp3dC1zZXJ2aWNlIiwibGFuZyI6ImVuX1VTIiwicHJvdmlkZXIiOiIiLCJzZXNzX2lkIjo3MjkwMzIxLCJzZXNzaW9uX2lkIjoiIiwic2Vzc2lvbl9zZXR0aW5nIjoxLCJzdWIiOjIwMDUwNywidHlwZSI6MSwidXNlciI6eyJjb21wYW55X2lkIjoyNzA1NCwiZW1haWwiOiJqb2pvZGVtb192bXNAZ21haWwuY29tIiwiaWQiOjIwMDUwNywidXNlcl9jb21wYW55X2lkIjoxNzI1NDUsInVzZXJfcm9sZSI6MSwidXNlcl9yb2xlX25hbWUiOiJhZG1pbiJ9fQ.xTWcTGLohI-EggY8fXYrudCoE6IA2Zd-cNW9c_ruiQk",
          },
          body: JSON.stringify({
            content: pdfBase64,
            filename: "document.pdf",
          }),
        }
      );

      if (!uploadResponse.ok) {
        alert("Failed to upload PDF.");
        return;
      }

      const uploadResult = await uploadResponse.json();
      const fileUrl = uploadResult.data.url; // Extract the file URL from the response

      // Extract query parameters from the page's URL
      const queryParams = new URLSearchParams(window.location.search);

      // Create the payload for the save API
      const payload = {
        editorContent, // Add editor content
        pdfUrl: fileUrl, // Add the uploaded file URL
      };

      // Send the data to the save API
      const saveResponse = await fetch(
        `https://api-oos.jojonomic.com/27054/mails/save-doc?${queryParams.toString()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (saveResponse.ok) {
        alert("Data saved successfully!");
      } else {
        alert("Failed to save data.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving data.");
    }
  };

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
        <NodeButton type="blockquote" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
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
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <Button onClick={generatePDF}>Generate PDF</Button>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <Button onClick={saveData}>Save</Button>
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
