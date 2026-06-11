import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getIpfsUrl } from "utils/getIpfsUrl";
import AttachmentIcon from "svgs/icons/attachment.svg";
import { Link } from "react-router-dom";
import { Evidence } from "src/types/Evidence";
import ExternalLinkWarning from "components/ExternalLinkWarning";

const JustificationDetails: React.FC<{ justification: Evidence }> = ({ justification }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState("");

  const handleConfirmNavigation = useCallback(() => {
    if (pendingUrl) {
      window.open(pendingUrl, "_blank", "noopener,noreferrer");
    }
    setIsWarningOpen(false);
    setPendingUrl("");
  }, [pendingUrl]);

  const handleCancelNavigation = useCallback(() => {
    setIsWarningOpen(false);
    setPendingUrl("");
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (event: Event) => {
      const linkElement = (event.target as HTMLElement).closest("a");
      if (!linkElement || !container.contains(linkElement)) return;

      const href = linkElement.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      setPendingUrl(href);
      setIsWarningOpen(true);
    };

    container.addEventListener("click", handleClick, true);

    return () => {
      container.removeEventListener("click", handleClick, true);
    };
  }, []);

  return (
    <div className="flex flex-col w-full">
      <h3 className="text-base text-klerosUIComponentsPrimaryText font-semibold">
        {justification.name ?? "Unable to determine title"}
      </h3>
      <div ref={containerRef} className="max-h-[400px] w-full overflow-y-scroll custom-scrollbar">
        <ReactMarkdown>{justification.description ?? "Unable to determine description"}</ReactMarkdown>
      </div>
      {justification?.fileURI && (
        <Link className="flex gap-1.5" to={`/attachment/?url=${getIpfsUrl(justification.fileURI)}`}>
          <AttachmentIcon width={16} className="fill-klerosUIComponentsPrimaryBlue" />
          View attached file
        </Link>
      )}
      <ExternalLinkWarning
        isOpen={isWarningOpen}
        sanitizedUrl={pendingUrl}
        onConfirm={handleConfirmNavigation}
        onCancel={handleCancelNavigation}
      />
    </div>
  );
};

export default JustificationDetails;
