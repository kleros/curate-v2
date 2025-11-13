import React, { Dispatch, SetStateAction, useMemo, useEffect } from "react";

import { TextField } from "@kleros/ui-components-library";
import { isEmpty } from "src/utils";

interface IForm {
  contactLabel: string;
  contactPlaceholder: string;
  contactInput: string;
  contactIsValid: boolean;
  setContactInput: Dispatch<SetStateAction<string>>;
  setContactIsValid: Dispatch<SetStateAction<boolean>>;
  validator: RegExp;
  isEditing?: boolean;
}

const FormContact: React.FC<IForm> = ({
  contactLabel,
  contactPlaceholder,
  contactInput,
  contactIsValid,
  setContactInput,
  setContactIsValid,
  validator,
  isEditing,
}) => {
  useEffect(() => {
    setContactIsValid(validator.test(contactInput));
  }, [contactInput, setContactIsValid, validator]);

  const fieldVariant = useMemo(() => {
    if (isEmpty(contactInput) || !isEditing) {
      return undefined;
    }
    return contactIsValid ? "success" : "error";
  }, [contactInput, contactIsValid, isEditing]);

  return (
    <>
      <label htmlFor="contact-input" className="flex mb-[10px]">
        {contactLabel}
      </label>
      <TextField
        className="items-center w-full [&_input]:text-sm"
        id="contact-input"
        variant={fieldVariant}
        value={contactInput}
        onChange={(value) => setContactInput(value)}
        placeholder={contactPlaceholder}
      />
    </>
  );
};

export default FormContact;
