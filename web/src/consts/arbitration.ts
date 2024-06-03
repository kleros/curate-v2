import { disputeTemplateRegistryAddress, evidenceModuleAddress, klerosCoreAddress } from "hooks/contracts/generated";
import { DEFAULT_CHAIN } from "./chains";

export const KLEROS_ARBITRATOR = klerosCoreAddress[DEFAULT_CHAIN];
export const EVIDENCE_MODULE = evidenceModuleAddress[DEFAULT_CHAIN];
export const TEMPLATE_REGISTRY = disputeTemplateRegistryAddress[DEFAULT_CHAIN];
// TODO: this would be ?
export const KLEROS_GOVERNOR = "0xf1C7c037891525E360C59f708739Ac09A7670c59";
