import React from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { DropdownSelect } from "@kleros/ui-components-library";
import { decodeItemURIFilter, encodeItemURIFilter, useItemRootPath } from "utils/uri";

const Container = styled.div`
  display: flex;
  justify-content: end;
  gap: 12px;
  width: fit-content;
`;

const Filters: React.FC = () => {
  const { order, filter } = useParams();
  const { ruled, period, ...filterObject } = decodeItemURIFilter(filter ?? "all");
  const navigate = useNavigate();
  const location = useItemRootPath();

  const handleStatusChange = (value: string | number) => {
    const parsedValue = JSON.parse(value as string);
    const encodedFilter = encodeItemURIFilter({ ...filterObject, ...parsedValue });
    navigate(`${location}/${order}/${encodedFilter}`);
  };

  const handleOrderChange = (value: string | number) => {
    const encodedFilter = encodeItemURIFilter({ ruled, period, ...filterObject });
    navigate(`${location}/${value}/${encodedFilter}`);
  };

  return (
    <Container>
      <DropdownSelect
        smallButton
        simpleButton
        items={[
          { value: "desc", text: "Newest" },
          { value: "asc", text: "Oldest" },
        ]}
        defaultValue={order}
        callback={handleOrderChange}
      />
    </Container>
  );
};

export default Filters;
