import { createUseReadContract, createUseSimulateContract, createUseWriteContract } from "wagmi/codegen";
import { curateV2Abi } from "./contracts/generated";

export const useSimulateCurateV2ExecuteRequest = createUseSimulateContract({
  abi: curateV2Abi,
  functionName: "executeRequest",
});

export const useWriteCurateV2ExecuteRequest = createUseWriteContract({
  abi: curateV2Abi,
  functionName: "executeRequest",
});

export const useSimulateCurateV2ChallengeRequest = createUseSimulateContract({
  abi: curateV2Abi,
  functionName: "challengeRequest",
});

export const useWriteCurateV2ChallengeRequest = createUseWriteContract({
  abi: curateV2Abi,
  functionName: "challengeRequest",
});

export const useSimulateCurateV2RemoveItem = createUseSimulateContract({
  abi: curateV2Abi,
  functionName: "removeItem",
});

export const useWriteCurateV2RemoveItem = createUseWriteContract({
  abi: curateV2Abi,
  functionName: "removeItem",
});

export const useSimulateCurateV2AddItem = createUseSimulateContract({
  abi: curateV2Abi,
  functionName: "addItem",
});

export const useWriteCurateV2AddItem = createUseWriteContract({
  abi: curateV2Abi,
  functionName: "addItem",
});

export const useReadCurateV2ChallengePeriodDuration = createUseReadContract({
  abi: curateV2Abi,
  functionName: "challengePeriodDuration",
});

export const useReadCurateV2GetArbitratorExtraData = createUseReadContract({
  abi: curateV2Abi,
  functionName: "getArbitratorExtraData",
});

export const useReadCurateV2RemovalBaseDeposit = createUseReadContract({
  abi: curateV2Abi,
  functionName: "removalBaseDeposit",
});

export const useReadCurateV2SubmissionBaseDeposit = createUseReadContract({
  abi: curateV2Abi,
  functionName: "submissionBaseDeposit",
});

export const useReadCurateV2SubmissionChallengeBaseDeposit = createUseReadContract({
  abi: curateV2Abi,
  functionName: "submissionChallengeBaseDeposit",
});

export const useReadCurateV2RemovalChallengeBaseDeposit = createUseReadContract({
  abi: curateV2Abi,
  functionName: "removalChallengeBaseDeposit",
});
