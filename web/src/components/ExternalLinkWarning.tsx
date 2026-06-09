import React from "react";
import { Button, Modal } from "@kleros/ui-components-library";
import clsx from "clsx";
import WarningIcon from "src/assets/svgs/icons/warning-outline.svg";

interface IExternalLinkWarning {
  isOpen: boolean;
  originalUrl?: string;
  sanitizedUrl: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const UrlDisplay: React.FC<{ url: string }> = ({ url }) => (
  <div
    className={clsx(
      "bg-klerosUIComponentsLightBackground border rounded-sm border-klerosUIComponentsStroke",
      "text-sm font-mono text-klerosUIComponentsPrimaryText break-all",
      "w-full py-2 px-3"
    )}
  >
    {url}
  </div>
);

const ExternalLinkWarning: React.FC<IExternalLinkWarning> = ({
  isOpen,
  originalUrl,
  sanitizedUrl,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      className={clsx(
        "flex flex-col items-start overflow-y-auto gap-6 p-6",
        "custom-scrollbar h-fit max-h-[80vh] w-120 max-w-[90vw]",
        "shadow-custom",
        "z-10"
      )}
      isOpen={isOpen}
      isDismissable
      onOpenChange={(open) => !open && onCancel()}
    >
      <div className="flex gap-2 items-center">
        <WarningIcon className="size-6" />
        <h3 className="text-klerosUIComponentsPrimaryText text-xl font-semibold items-center">External Link Warning</h3>
      </div>
      <p className="text-klerosUIComponentsSecondaryText text-sm">
        You are about to navigate to an external website. Please verify the URL before proceeding to ensure it's safe
        and legitimate.
      </p>

      <div className="flex flex-col gap-4 items-start w-full">
        {originalUrl ? (
          <div className="flex flex-col gap-1 w-full">
            <label className="text-klerosUIComponentsSecondaryText font-semibold text-sm">Original Url:</label>
            <UrlDisplay url={originalUrl} />
          </div>
        ) : null}
        <div className="flex flex-col gap-1 w-full">
          {originalUrl ? (
            <label className="text-klerosUIComponentsSecondaryText font-semibold text-sm">
              External Url (sanitized):
            </label>
          ) : null}
          <UrlDisplay url={sanitizedUrl} />
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-klerosUIComponentsPrimaryText text-base mb-2">Safety tips:</h4>
        <ul className="list-disc flex flex-col gap-2">
          {[
            "Verify the domain name is correct",
            "Check for suspicious characters or typos",
            "Only proceed if you trust this destination",
          ].map((msg) => (
            <li key={msg} className="text-sm text-klerosUIComponentsPrimaryText ml-4 ">
              {msg}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center w-full gap-3 mt-1">
        <Button variant="secondary" text="Cancel" onPress={onCancel} />
        <Button
          className={clsx(
            "bg-klerosUIComponentsWarning [&_.button-text]:text-klerosUIComponentsWhiteBackground hover:bg-klerosUIComponentsWarning/75",
            "border border-klerosUIComponentsWarning"
          )}
          text="Continue to External Site"
          onPress={onConfirm}
        />
      </div>
    </Modal>
  );
};

export default ExternalLinkWarning;
