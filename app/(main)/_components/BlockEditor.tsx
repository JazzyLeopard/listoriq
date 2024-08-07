"use client";

import "@blocknote/core/fonts/inter.css";
import { DragHandleButton, useCreateBlockNote, getDefaultReactSlashMenuItems, DefaultReactSuggestionItem, SuggestionMenuController, BlockNoteContext } from "@blocknote/react";
import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@/app/custom.css";
import { AiPromptButton } from "@/components/ui/AiPromptButton";
import { FormattingToolbar } from "@blocknote/react";
import AiPromptBar from "./aiPrompt";
import { RemoveBlockButton } from "./RemoveBlockButton";
import { useState, useEffect } from "react";
import { Bold, Italic, Underline, Strikethrough, Code } from "lucide-react"
import { debounce } from "lodash";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useBlockEditor } from "@/app/hooks/useBlockEditor";

type BlockEditorProps = {
  onBlur: () => Promise<void>;
  attribute: string;
  projectDetails: any;
  setProjectDetails: (value: any) => void
};

export default function BlockEditor({
  onBlur,
  attribute,
  projectDetails,
  setProjectDetails,
}: BlockEditorProps) {
  const [isAiPromptOpen, setIsAiPromptOpen] = useState(false);
  const editor = useCreateBlockNote({
    initialContent: projectDetails[attribute] ? JSON.parse(projectDetails[attribute]) : undefined,
  });

  const toggleAiPrompt = () => {
    setIsAiPromptOpen((prev) => !prev);
  };

  type StyleKeys = keyof typeof editor.schema.styleSchema;

  const toggleStyle = (style: StyleKeys) => {
    editor.focus();

    if (editor.schema.styleSchema[style].propSchema !== "boolean") {
      throw new Error("can only toggle boolean styles");
    }

    const isActive = style in editor.getActiveStyles();
    editor.toggleStyles({ [style]: !isActive } as any);
  };

  const saveContent = debounce(() => {
    const content = JSON.stringify(editor.document); // Retrieve the document content
    // setProjectDetails((prevDetails: any) => ({
    //   ...prevDetails,
    //   [attribute]: content,
    // }));
    setProjectDetails(content)

  }, 2000);

  useEffect(() => {
    if (editor) {
      editor.onChange(() => {
        saveContent();
      });
    }
  }, [editor, attribute, setProjectDetails]);

  // Custom function to get filtered Slash Menu items
  const getCustomSlashMenuItems = (
    editor: BlockNoteEditor
  ): DefaultReactSuggestionItem[] => {
    const defaultItems = getDefaultReactSlashMenuItems(editor);
    // Filter out the Heading items
    return defaultItems.filter(
      (item) => !["Heading 1", "Heading 2", "Heading 3"].includes(item.title)
    );
  };

  // Renders the editor instance using a React component.
  return (
    <>
      <div>
        {/* @ts-ignore */}
        <BlockNoteContext.Provider value={editor}>
        <div className="flex justify-between py-3 border-b border-gray-200">
            <ToggleGroup type="single" defaultValue="none">
              <ToggleGroupItem value="bold" onClick={() => toggleStyle("bold")}>
              <Bold className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" onClick={() => toggleStyle("italic")}>
              <Italic className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="underline" onClick={() => toggleStyle("underline")}>
              <Underline className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="strike" onClick={() => toggleStyle("strike")}>
              <Strikethrough className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="code" onClick={() => toggleStyle("code")}>
              <Code className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="ai" onClick={() => toggleAiPrompt()}>
              <AiPromptButton/>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <BlockNoteView
            editor={editor} 
            formattingToolbar={false} 
            data-theming-css 
            sideMenu={false} 
            slashMenu={false} // Disable default Slash Menu
            onBlur={onBlur}
            style={{ paddingTop: "16px" }}
          >
              <SuggestionMenuController
                triggerCharacter={"/"}
                // Replaces the default Slash Menu items with our custom ones.
                getItems={async (query) =>
                  filterSuggestionItems(getCustomSlashMenuItems(editor), query)
                }
              />
          </BlockNoteView>
          {isAiPromptOpen && <AiPromptBar onClose={() => setIsAiPromptOpen(false)} />}
        </BlockNoteContext.Provider>
      </div>
      
    </>
  );
}

{/* <AiPromptButton onToggle={toggleAiPrompt} {...{isAiPromptOpen}}/> */}