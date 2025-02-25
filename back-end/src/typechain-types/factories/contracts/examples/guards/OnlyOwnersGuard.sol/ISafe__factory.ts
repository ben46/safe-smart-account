/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  ISafe,
  ISafeInterface,
} from "../../../../../contracts/examples/guards/OnlyOwnersGuard.sol/ISafe";

const _abi = [
  {
    inputs: [],
    name: "getOwners",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class ISafe__factory {
  static readonly abi = _abi;
  static createInterface(): ISafeInterface {
    return new utils.Interface(_abi) as ISafeInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ISafe {
    return new Contract(address, _abi, signerOrProvider) as ISafe;
  }
}
