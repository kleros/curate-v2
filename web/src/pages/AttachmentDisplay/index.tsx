import React, { lazy, Suspense } from "react";

import { Link, useSearchParams } from "react-router-dom";

import NewTabIcon from "svgs/icons/new-tab.svg";

import Loader from "components/Loader";
import Header from "./Header";
import clsx from "clsx";

const FileViewer = lazy(() => import("components/FileViewer"));

const AttachmentDisplay: React.FC = () => {
  const [searchParams] = useSearchParams();

  const url = searchParams.get("url");
  return (
    <div
      className={clsx(
        "w-full max-w-landscape my-0 mx-auto bg-klerosUIComponentsLightBackground",
        "p-fluid-24-136 pt-fluid-32-80 pb-fluid-76-96"
      )}
    >
      <div className="flex flex-col gap-2 w-full">
        <Header />
        {url ? (
          <>
            <Link
              className="flex items-center self-end gap-2 hover:underline"
              to={url}
              rel="noreferrer"
              target="_blank"
              aria-label="Open in new tab"
            >
              Open in new tab <NewTabIcon className="fill-klerosUIComponentsPrimaryBlue" />
            </Link>
            <Suspense
              fallback={
                <div className="flex justify-center w-full">
                  <Loader width={"48px"} height={"48px"} />
                </div>
              }
            >
              <FileViewer url={url} />
            </Suspense>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default AttachmentDisplay;
