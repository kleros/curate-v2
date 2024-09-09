import React, { useEffect, useState } from "react";
import { Copiable } from "@kleros/ui-components-library";
import Skeleton from "react-loading-skeleton";
import { RegistryDetails } from "context/RegistryDetailsContext";
import styled, { css } from "styled-components";
import StatusDisplay from "../StatusDisplay";
import { DEFAULT_CHAIN, SUPPORTED_CHAINS } from "src/consts/chains";
import { landscapeStyle } from "src/styles/landscapeStyle";
import { responsiveSize } from "src/styles/responsiveSize";
import { isUndefined } from "src/utils";
import { DEFAULT_LIST_LOGO } from "src/consts";
import { getIpfsUrl } from "utils/getIpfsUrl";
import { shortenAddress } from "utils/shortenAddress";
import { Link } from "react-router-dom";

const TopInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: ${responsiveSize(20, 24)} ${responsiveSize(24, 32)} 12px ${responsiveSize(24, 32)};
  ${landscapeStyle(
    () => css`
      flex-wrap: nowrap;
    `
  )}
`;

const LogoAndTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const TopLeftInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${responsiveSize(8, 16)} 0;
`;

const TopRightInfo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
  flex-wrap: wrap;
  flex-shrink: 1;
  align-items: start;
  padding-top: 20px;
  ${landscapeStyle(
    () => css`
      flex-shrink: 0;
      gap: 0 ${responsiveSize(24, 32, 900)};
    `
  )}
`;

const StyledLogo = styled.img<{ isListView: boolean }>`
  width: ${({ isListView }) => (isListView ? "40px" : "125px")};
  height: ${({ isListView }) => (isListView ? "40px" : "125px")};
  object-fit: contain;
  margin-bottom: ${({ isListView }) => (isListView ? "0px" : "8px")};
`;

const StyledTitle = styled.h1`
  margin: 0;
`;

const StyledP = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  margin: 0;
`;

const StyledA = styled.a`
  color: ${({ theme }) => theme.primaryBlue};
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`;

const SkeletonLogo = styled(Skeleton)`
  width: 125px;
  height: 125px;
  border-radius: 62.5px;
  margin-bottom: 8px;
`;

const SkeletonTitle = styled(Skeleton)`
  width: 180px;
  height: 30px;
`;

const SkeletonDescription = styled(Skeleton)`
  width: 90%;
  height: 21px;
`;

interface ITopInfo
  extends Pick<
    RegistryDetails,
    "description" | "title" | "logoURI" | "status" | "disputed" | "id" | "latestRequestSubmissionTime"
  > {
  registryAddress: string;
}

const TopInfo: React.FC<ITopInfo> = ({
  id,
  title,
  description,
  logoURI,
  status,
  disputed,
  latestRequestSubmissionTime,
  registryAddress,
}) => {
  const [imageSrc, setImageSrc] = useState(getIpfsUrl(logoURI ?? ""));
  useEffect(() => setImageSrc(getIpfsUrl(logoURI ?? "")), [logoURI]);
  return (
    <TopInfoContainer>
      <TopLeftInfo>
        <LogoAndTitle>
          {isUndefined(logoURI) ? (
            <SkeletonLogo />
          ) : (
            <Link to={`/attachment/?url=${imageSrc}`}>
              <StyledLogo
                src={imageSrc}
                onError={() => setImageSrc(getIpfsUrl(DEFAULT_LIST_LOGO))}
                alt="List Img"
                isListView={false}
              />
            </Link>
          )}
          {isUndefined(title) ? <SkeletonTitle /> : <StyledTitle>{title}</StyledTitle>}
        </LogoAndTitle>
        {isUndefined(description) ? <SkeletonDescription /> : <StyledP>{description}</StyledP>}
      </TopLeftInfo>
      <TopRightInfo>
        {id !== "" ? (
          <Copiable copiableContent={id} info="Copy Registry Address" iconPlacement="left">
            <StyledA
              href={`${SUPPORTED_CHAINS[DEFAULT_CHAIN].blockExplorers?.default.url}/address/${id}`}
              target="_blank"
              rel="noreferrer"
            >
              {shortenAddress(id)}
            </StyledA>
          </Copiable>
        ) : (
          <Skeleton width={80} height={16} />
        )}
        <StatusDisplay {...{ status, disputed, registryAddress, latestRequestSubmissionTime }} />
      </TopRightInfo>
    </TopInfoContainer>
  );
};

export default TopInfo;
