import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { landscapeStyle } from "styles/landscapeStyle";
import Skeleton from "react-loading-skeleton";
import { Button } from "@kleros/ui-components-library";
import ArrowIcon from "svgs/icons/arrow.svg";
import { Status } from "consts/status";
import { getIpfsUrl } from "utils/getIpfsUrl";
import StatusBanner from "./StatusBanner";
import { DEFAULT_LIST_LOGO } from "consts/index";

const Container = styled.div<{ isListView: boolean }>`
  height: calc(100% - 45px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;

  // css for isList view
  ${({ isListView }) =>
    isListView &&
    css`
      width: 100%;
      height: max-content;
      display: grid;
      grid-template-rows: repeat(3, min-content);
      grid-template-columns: 21px max-content 1fr max-content;
      column-gap: ${responsiveSize(8, 12, 900)};
      row-gap: 16px;
      padding: 16px;
      h3,
      img {
        grid-column: span 4;
      }
      ${landscapeStyle(
        () => css`
          height: 64px;
          justify-content: space-between;
          grid-template-rows: 1fr;
          grid-template-columns: auto 1fr 60px ${responsiveSize(80, 100, 900)} ${responsiveSize(100, 150, 900)} max-content;
          padding: 0 32px;
          img {
            grid-column: 1;
          }
          h3 {
            grid-column: 2;
          }
        `
      )}
    `}
`;

const StyledLogo = styled.img<{ isListView: boolean }>`
  width: ${({ isListView }) => (isListView ? "48px" : "125px")};
  height: ${({ isListView }) => (isListView ? "48px" : "125px")};
  object-fit: contain;
  margin-bottom: ${({ isListView }) => (isListView ? "0px" : "8px")};
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => theme.secondaryText};
`;

const StyledTitle = styled.h3`
  font-weight: 400;
  margin: 0px;
`;

const TruncatedTitle = ({ text, maxLength }) => {
  const truncatedText = text?.length <= maxLength ? text : text?.slice(0, maxLength) + "…";
  return <StyledTitle>{truncatedText}</StyledTitle>;
};

const StyledButton = styled(Button)`
  background-color: transparent;
  padding: 0;
  flex-direction: row-reverse;
  gap: 8px;
  .button-text {
    color: ${({ theme }) => theme.primaryBlue};
    font-weight: 400;
  }
  .button-svg {
    fill: ${({ theme }) => theme.secondaryPurple};
  }

  :focus,
  :hover {
    background-color: transparent;
  }
`;

const SkeletonLogo = styled(Skeleton)<{ isListView: boolean }>`
  width: ${({ isListView }) => (isListView ? "48px" : "125px")};
  height: ${({ isListView }) => (isListView ? "48px" : "125px")};
  border-radius: ${({ isListView }) => (isListView ? "24px" : "62.5px")};
  margin-bottom: ${({ isListView }) => (isListView ? "0px" : "8px")};
`;

interface IListInfo {
  title: string;
  totalItems: number;
  logoURI: string;
  chainId: number;
  status: Status;
  isListView?: boolean;
}

const ListInfo: React.FC<IListInfo> = ({ title, totalItems, logoURI, chainId, status, isListView = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(getIpfsUrl(logoURI));

  useEffect(() => setImageSrc(getIpfsUrl(logoURI)), [logoURI]);
  return (
    <Container {...{ isListView }}>
      {!imageLoaded ? <SkeletonLogo isListView={isListView} /> : null}
      <StyledLogo
        src={imageSrc}
        alt="List Img"
        isListView={isListView}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageSrc(getIpfsUrl(DEFAULT_LIST_LOGO))}
        style={{ display: imageLoaded ? "block" : "none" }}
      />
      <TruncatedTitle text={title} maxLength={100} />
      <StyledLabel>{totalItems} items</StyledLabel>
      {isListView && <StatusBanner {...{ status, isListView }} />}
      {isListView && <StyledButton text="Open" Icon={ArrowIcon} />}
    </Container>
  );
};

export default ListInfo;
