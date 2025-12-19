import React from "react";

import { type DocRenderer } from "@cyntler/react-doc-viewer";
import ReactMarkdown from "react-markdown";

const MarkdownRenderer: DocRenderer = ({ mainState: { currentDocument } }) => {
  if (!currentDocument) return null;
  const base64String = (currentDocument.fileData as string).split(",")[1];

  // Decode the base64 string
  const decodedData = atob(base64String);

  return (
    <div className="p-4" id="md-renderer">
      <ReactMarkdown className="bg-klerosUIComponentsWhiteBackground [&_a]:text-base [&_code]:text-klerosUIComponentsSecondaryText">
        {decodedData}
      </ReactMarkdown>
    </div>
  );
};

MarkdownRenderer.fileTypes = ["md", "text/plain"];
MarkdownRenderer.weight = 1;

export default MarkdownRenderer;
