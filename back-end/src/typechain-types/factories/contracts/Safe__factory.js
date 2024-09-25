"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Safe__factory = void 0;
var ethers_1 = require("ethers");
var _abi = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        name: "AddedOwner",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "approvedHash",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        name: "ApproveHash",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "threshold",
                type: "uint256",
            },
        ],
        name: "ChangedThreshold",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "txHash",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "payment",
                type: "uint256",
            },
        ],
        name: "ExecutionFailure",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "txHash",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "payment",
                type: "uint256",
            },
        ],
        name: "ExecutionSuccess",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        name: "RemovedOwner",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "initiator",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address[]",
                name: "owners",
                type: "address[]",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "threshold",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "initializer",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "fallbackHandler",
                type: "address",
            },
        ],
        name: "SafeSetup",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "msgHash",
                type: "bytes32",
            },
        ],
        name: "SignMsg",
        type: "event",
    },
    {
        inputs: [],
        name: "VERSION",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_threshold",
                type: "uint256",
            },
        ],
        name: "addOwnerWithThreshold",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "hashToApprove",
                type: "bytes32",
            },
        ],
        name: "approveHash",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        name: "approvedHashes",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_threshold",
                type: "uint256",
            },
        ],
        name: "changeThreshold",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "dataHash",
                type: "bytes32",
            },
            {
                internalType: "bytes",
                name: "data",
                type: "bytes",
            },
            {
                internalType: "bytes",
                name: "signatures",
                type: "bytes",
            },
            {
                internalType: "uint256",
                name: "requiredSignatures",
                type: "uint256",
            },
        ],
        name: "checkNSignatures",
        outputs: [],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "dataHash",
                type: "bytes32",
            },
            {
                internalType: "bytes",
                name: "data",
                type: "bytes",
            },
            {
                internalType: "bytes",
                name: "signatures",
                type: "bytes",
            },
        ],
        name: "checkSignatures",
        outputs: [],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "domainSeparator",
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
        inputs: [
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "data",
                type: "bytes",
            },
            {
                internalType: "enum Enum.Operation",
                name: "operation",
                type: "uint8",
            },
            {
                internalType: "uint256",
                name: "safeTxGas",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "baseGas",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "gasPrice",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "gasToken",
                type: "address",
            },
            {
                internalType: "address",
                name: "refundReceiver",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_nonce",
                type: "uint256",
            },
        ],
        name: "encodeTransactionData",
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
        inputs: [
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "data",
                type: "bytes",
            },
            {
                internalType: "enum Enum.Operation",
                name: "operation",
                type: "uint8",
            },
            {
                internalType: "uint256",
                name: "safeTxGas",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "baseGas",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "gasPrice",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "gasToken",
                type: "address",
            },
            {
                internalType: "address payable",
                name: "refundReceiver",
                type: "address",
            },
            {
                internalType: "bytes",
                name: "signatures",
                type: "bytes",
            },
        ],
        name: "execTransaction",
        outputs: [
            {
                internalType: "bool",
                name: "success",
                type: "bool",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "getChainId",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
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
    {
        inputs: [],
        name: "getThreshold",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "data",
                type: "bytes",
            },
            {
                internalType: "enum Enum.Operation",
                name: "operation",
                type: "uint8",
            },
            {
                internalType: "uint256",
                name: "safeTxGas",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "baseGas",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "gasPrice",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "gasToken",
                type: "address",
            },
            {
                internalType: "address",
                name: "refundReceiver",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_nonce",
                type: "uint256",
            },
        ],
        name: "getTransactionHash",
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
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        name: "isOwner",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nonce",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "prevOwner",
                type: "address",
            },
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_threshold",
                type: "uint256",
            },
        ],
        name: "removeOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address[]",
                name: "_owners",
                type: "address[]",
            },
            {
                internalType: "uint256",
                name: "_threshold",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "bytes",
                name: "data",
                type: "bytes",
            },
            {
                internalType: "address",
                name: "fallbackHandler",
                type: "address",
            },
            {
                internalType: "address",
                name: "paymentToken",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "payment",
                type: "uint256",
            },
            {
                internalType: "address payable",
                name: "paymentReceiver",
                type: "address",
            },
        ],
        name: "setup",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "prevOwner",
                type: "address",
            },
            {
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "swapOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
var Safe__factory = /** @class */ (function () {
    function Safe__factory() {
    }
    Safe__factory.createInterface = function () {
        return new ethers_1.utils.Interface(_abi);
    };
    Safe__factory.connect = function (address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    };
    Safe__factory.abi = _abi;
    return Safe__factory;
}());
exports.Safe__factory = Safe__factory;
