import React from "react";

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="inline-flex gap-1">
    <small className="text-sm font-semibold leading-18px text-klerosUIComponentsPrimaryText">{value}</small>
    <label className="text-klerosUIComponentsPrimaryText">{label}</label>
  </div>
);

const Separator: React.FC = () => <label className="text-klerosUIComponentsPrimaryText">|</label>;

type Field = {
  label: string;
  value: string;
};

export interface IStats {
  fields: Field[];
}

const Stats: React.FC<IStats> = ({ fields }) => {
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
