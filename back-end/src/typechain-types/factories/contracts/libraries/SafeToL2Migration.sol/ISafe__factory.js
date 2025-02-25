"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISafe__factory = void 0;
var ethers_1 = require("ethers");
var _abi = [
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
                name: "handler",
                type: "address",
            },
        ],
        name: "setFallbackHandler",
        outputs: [],
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
