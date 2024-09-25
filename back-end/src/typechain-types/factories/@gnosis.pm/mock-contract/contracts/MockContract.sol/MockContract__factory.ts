/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  MockContract,
  MockContractInterface,
} from "../../../../../@gnosis.pm/mock-contract/contracts/MockContract.sol/MockContract";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [],
    name: "DEFAULT_FALLBACK_VALUE",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MOCKS_LIST_END",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MOCKS_LIST_END_HASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MOCKS_LIST_START",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SENTINEL_ANY_MOCKS",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "response",
        type: "bytes",
      },
    ],
    name: "givenAnyReturn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "response",
        type: "address",
      },
    ],
    name: "givenAnyReturnAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "response",
        type: "bool",
      },
    ],
    name: "givenAnyReturnBool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "response",
        type: "uint256",
      },
    ],
    name: "givenAnyReturnUint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "givenAnyRevert",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "givenAnyRevertWithMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "givenAnyRunOutOfGas",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "call",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "response",
        type: "bytes",
      },
    ],
    name: "givenCalldataReturn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "call",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "response",
        type: "address",
      },
    ],
    name: "givenCalldataReturnAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "call",
        type: "bytes",
      },
      {
        internalType: "bool",
        name: "response",
        type: "bool",
      },
    ],
    name: "givenCalldataReturnBool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "call",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "response",
        type: "uint256",
      },
    ],
    name: "givenCalldataReturnUint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "call",
        type: "bytes",
      },
    ],
    name: "givenCalldataRevert",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "call",
        type: "bytes",
      },
      {
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "givenCalldataRevertWithMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "call",
        type: "bytes",
      },
    ],
    name: "givenCalldataRunOutOfGas",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "call",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "response",
        type: "bytes",
      },
    ],
    name: "givenMethodReturn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "call",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "response",
        type: "address",
      },
    ],
    name: "givenMethodReturnAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "call",
        type: "bytes",
      },
      {
        internalType: "bool",
        name: "response",
        type: "bool",
      },
    ],
    name: "givenMethodReturnBool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "call",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "response",
        type: "uint256",
      },
    ],
    name: "givenMethodReturnUint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "call",
        type: "bytes",
      },
    ],
    name: "givenMethodRevert",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "call",
        type: "bytes",
      },
      {
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "givenMethodRevertWithMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "call",
        type: "bytes",
      },
    ],
    name: "givenMethodRunOutOfGas",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "invocationCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "call",
        type: "bytes",
      },
    ],
    name: "invocationCountForCalldata",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "call",
        type: "bytes",
      },
    ],
    name: "invocationCountForMethod",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "reset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "methodId",
        type: "bytes4",
      },
      {
        internalType: "bytes",
        name: "originalMsgData",
        type: "bytes",
      },
    ],
    name: "updateInvocationCount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class MockContract__factory {
  static readonly abi = _abi;
  static createInterface(): MockContractInterface {
    return new utils.Interface(_abi) as MockContractInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockContract {
    return new Contract(address, _abi, signerOrProvider) as MockContract;
  }
}
