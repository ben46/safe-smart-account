/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  SafeProxy,
  SafeProxyInterface,
} from "../../../../contracts/proxies/SafeProxy.sol/SafeProxy";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_singleton",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
] as const;

export class SafeProxy__factory {
  static readonly abi = _abi;
  static createInterface(): SafeProxyInterface {
    return new utils.Interface(_abi) as SafeProxyInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SafeProxy {
    return new Contract(address, _abi, signerOrProvider) as SafeProxy;
  }
}
