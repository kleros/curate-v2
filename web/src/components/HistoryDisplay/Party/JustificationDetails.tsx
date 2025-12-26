import React from "react";
import ReactMarkdown from "react-markdown";
import { getIpfsUrl } from "utils/getIpfsUrl";
import AttachmentIcon from "svgs/icons/attachment.svg";
import { Link } from "react-router-dom";
import { Evidence } from "src/types/Evidence";

const JustificationDetails: React.FC<{ justification: Evidence }> = ({ justification }) => {
  return (
    <div className="flex flex-col w-full">
      <h3 className="text-base text-klerosUIComponentsPrimaryText font-semibold">
        {justification.name ?? "Unable to determine title"}
      </h3>
      <div className="max-h-[400px] w-full overflow-y-scroll custom-scrollbar">
        <ReactMarkdown>{justification.description ?? "Unable to determine description"}</ReactMarkdown>
      </div>
      {justification?.fileURI && (
        <Link className="flex gap-1.5" to={`/attachment/?url=${getIpfsUrl(justification.fileURI)}`}>
          <AttachmentIcon width={16} className="fill-klerosUIComponentsPrimaryBlue" />
          View attached file
        </Link>
      )}
    </div>
  );
};

export default JustificationDetails;
