"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISafe__factory = void 0;
var ethers_1 = require("ethers");
var _abi = [
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
                internalType: "uint8",
                name: "operation",
                type: "uint8",
            },
        ],
        name: "execTransactionFromModule",
        outputs: [
            {
                internalType: "bool",
                name: "success",
                type: "bool",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
];
var ISafe__factory = /** @class */ (function () {
    function ISafe__factory() {
    }
    ISafe__factory.createInterface = function () {
        return new ethers_1.utils.Interface(_abi);
    };
    ISafe__factory.connect = function (address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    };
    ISafe__factory.abi = _abi;
    return ISafe__factory;
}());
exports.ISafe__factory = ISafe__factory;
