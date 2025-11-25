import React from "react";
import Stats, { IStats } from "./Stats";
import Filters, { IFilters } from "./Filters";

const StatsAndFilters: React.FC<IStats & IFilters> = ({ fields, isListFilter }) => (
  <div className="flex flex-wrap gap-2 mt-3 mb-12 justify-between">
    <Stats {...{ fields }} />
    <Filters {...{ isListFilter }} />
  </div>
);

export default StatsAndFilters;
