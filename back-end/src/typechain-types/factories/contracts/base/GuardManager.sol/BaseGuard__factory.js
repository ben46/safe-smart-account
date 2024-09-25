"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGuard__factory = void 0;
var ethers_1 = require("ethers");
var _abi = [
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "txHash",
                type: "bytes32",
            },
            {
                internalType: "bool",
                name: "success",
                type: "bool",
            },
        ],
        name: "checkAfterExecution",
        outputs: [],
        stateMutability: "nonpayable",
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
            {
                internalType: "address",
                name: "msgSender",
                type: "address",
            },
        ],
        name: "checkTransaction",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
            },
        ],
        name: "supportsInterface",
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
];
var BaseGuard__factory = /** @class */ (function () {
    function BaseGuard__factory() {
    }
    BaseGuard__factory.createInterface = function () {
        return new ethers_1.utils.Interface(_abi);
    };
    BaseGuard__factory.connect = function (address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    };
    BaseGuard__factory.abi = _abi;
    return BaseGuard__factory;
}());
exports.BaseGuard__factory = BaseGuard__factory;
