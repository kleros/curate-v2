import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ArbitratorMock, CurateFactory, CurateV2, DisputeTemplateRegistryMock } from "../typechain-types";

export const Status = {
  Absent: 0,
  Registered: 1,
  RegistrationRequested: 2,
  ClearingRequested: 3,
} as const;

export const Party = {
  None: 0,
  Requester: 1,
  Challenger: 2,
} as const;

export const CHALLENGE_PERIOD = 600;
export const ARBITRATION_COST = 1000n;
export const BASE_DEPOSIT = ethers.parseEther("0.00001");
export const REQUEST_VALUE = ARBITRATION_COST + BASE_DEPOSIT;
export const EXTRA_DATA = "0x1234";
export const LIST_METADATA = '{"title":"Test list","itemName":"item","itemNamePlural":"items","columns":[]}';

export interface Setup {
  curate: CurateV2;
  factory: CurateFactory;
  arbitrator: ArbitratorMock;
  templateRegistry: DisputeTemplateRegistryMock;
  governor: HardhatEthersSigner;
  relayer: HardhatEthersSigner;
  requester: HardhatEthersSigner;
  challenger: HardhatEthersSigner;
}

/// Deploys the implementation, the factory and one list through the factory (the production path).
export async function deployCurate(): Promise<Setup> {
  const [governor, relayer, requester, challenger] = await ethers.getSigners();

  const arbitrator = (await (
    await ethers.getContractFactory("ArbitratorMock")
  ).deploy(ARBITRATION_COST)) as ArbitratorMock;
  const templateRegistry = (await (
    await ethers.getContractFactory("DisputeTemplateRegistryMock")
  ).deploy()) as DisputeTemplateRegistryMock;
  const implementation = (await (await ethers.getContractFactory("CurateV2")).deploy()) as CurateV2;
  const factory = (await (
    await ethers.getContractFactory("CurateFactory")
  ).deploy(implementation.target)) as CurateFactory;

  await (
    await factory.deploy(
      governor.address,
      arbitrator.target,
      EXTRA_DATA,
      ethers.ZeroAddress,
      {
        templateRegistry: templateRegistry.target,
        registrationTemplateParameters: ["{}", "{}"],
        removalTemplateParameters: ["{}", "{}"],
      },
      [BASE_DEPOSIT, BASE_DEPOSIT, BASE_DEPOSIT, BASE_DEPOSIT],
      CHALLENGE_PERIOD,
      relayer.address,
      LIST_METADATA
    )
  ).wait();

  const curate = (await ethers.getContractAt("CurateV2", await factory.instances(0))) as CurateV2;
  return { curate, factory, arbitrator, templateRegistry, governor, relayer, requester, challenger };
}

/// The item ID as computed on-chain: keccak256(abi.encodePacked(item)).
export function itemID(item: string): string {
  return ethers.keccak256(ethers.toUtf8Bytes(item));
}

/// One step of the on-chain hash chain: keccak256(abi.encode(previousHead, itemID, newStatus)).
export function nextHead(previousHead: string, id: string, status: number): string {
  return ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(["bytes32", "bytes32", "uint8"], [previousHead, id, status])
  );
}

/// Folds a sequence of (itemID, status) transitions from the zero head.
export function foldHead(transitions: Array<[string, number]>): string {
  return transitions.reduce((head, [id, status]) => nextHead(head, id, status), ethers.ZeroHash);
}
