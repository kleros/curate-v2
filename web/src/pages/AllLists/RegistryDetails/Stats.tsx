import React from "react";
import styled from "styled-components";

const FieldWrapper = styled.div`
  display: inline-flex;
  gap: 4px;
`;

const SeparatorLabel = styled.label`
  margin: 0 8px;
  color: ${({ theme }) => theme.primaryText};
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => theme.primaryText};
`;

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <FieldWrapper>
    <small>{value}</small>
    <StyledLabel>{label}</StyledLabel>
  </FieldWrapper>
);

const Separator: React.FC = () => <SeparatorLabel>|</SeparatorLabel>;

export interface IStats {
  totalItems: number;
}

const Stats: React.FC<IStats> = ({ totalItems }) => {
  const fields = [{ label: "Items", value: totalItems.toString() }];

  return (
    <div>
      {fields.map(({ label, value }, i) => (
        <React.Fragment key={i}>
          <Field {...{ label, value }} />
          {i + 1 < fields.length ? <Separator /> : null}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stats;
