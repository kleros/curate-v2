import React, { useCallback } from "react";

import { Button } from "@kleros/ui-components-library";

import HourglassIcon from "svgs/icons/hourglass.svg";
import { useAtlasProvider } from "@kleros/kleros-app";
import { errorToast, infoToast, successToast } from "utils/wrapWithToast";

interface IEmailInfo {
  toggleIsSettingsOpen: () => void;
}

const EmailVerificationInfo: React.FC<IEmailInfo> = ({ toggleIsSettingsOpen }) => {
  const { userExists, user, updateEmail } = useAtlasProvider();

  const resendVerificationEmail = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!user) return;
      infoToast(`Sending verification email ...`);
      updateEmail({ newEmail: user.email })
        .then(async (res) => {
          if (res) {
            successToast("Verification email sent successfully!");
            toggleIsSettingsOpen();
          }
        })
        .catch((err) => {
          console.log(err);
          errorToast(`Failed to send verification email: ${err?.message}`);
        });
    },
    [user, updateEmail, toggleIsSettingsOpen]
  );

  return userExists && !user?.isEmailVerified ? (
    <div className="flex flex-row items-center gap-4 w-full pt-4 mt-8 border-t border-klerosUIComponentsStroke">
      <HourglassIcon className="w-8 h-8 fill-klerosUIComponentsPrimaryBlue" />
      <div className="flex flex-col items-start gap-2">
        <h3 className="m-0">Email Verification Pending</h3>
        <label>
          We sent you a verification email. Please, verify it.
          <br /> Didn’t receive the email? <Button text="Resend it" onClick={resendVerificationEmail} />
        </label>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default EmailVerificationInfo;
