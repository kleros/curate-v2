import React, { useCallback, useState } from "react";
import Globe from "svgs/icons/globe.svg";
import { getSafeNavigationUrl } from "utils/urlValidation";
import ExternalLinkWarning from "components/ExternalLinkWarning";

export interface ILinkField {
  value: string;
  detailed?: boolean;
}

const LinkField: React.FC<ILinkField> = ({ value }) => {
  const safeUrl = getSafeNavigationUrl(value);
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  const handleConfirmNavigation = useCallback(() => {
    if (safeUrl) {
      window.open(safeUrl, "_blank", "noopener,noreferrer");
    }
    setIsWarningOpen(false);
  }, []);

  const handleCancelNavigation = useCallback(() => {
    setIsWarningOpen(false);
  }, []);

  if (!safeUrl) {
    return (
      <span className="flex gap-2">
        <Globe />
        {value}
      </span>
    );
  }

  return (
    <>
      <a
        className="flex gap-2"
        href={safeUrl}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsWarningOpen(true);
        }}
        rel="noopener noreferrer"
      >
        <Globe />
        {value}
      </a>
      <ExternalLinkWarning
        isOpen={isWarningOpen}
        originalUrl={value !== safeUrl ? value : safeUrl}
        sanitizedUrl={safeUrl}
        onConfirm={handleConfirmNavigation}
        onCancel={handleCancelNavigation}
      />
    </>
  );
};

export default LinkField;
