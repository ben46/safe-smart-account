"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERC777TokensRecipient__factory = void 0;
var ethers_1 = require("ethers");
var _abi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "operator",
                type: "address",
            },
            {
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "data",
                type: "bytes",
            },
            {
                internalType: "bytes",
                name: "operatorData",
                type: "bytes",
            },
        ],
        name: "tokensReceived",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
var ERC777TokensRecipient__factory = /** @class */ (function () {
    function ERC777TokensRecipient__factory() {
    }
    ERC777TokensRecipient__factory.createInterface = function () {
        return new ethers_1.utils.Interface(_abi);
    };
    ERC777TokensRecipient__factory.connect = function (address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    };
    ERC777TokensRecipient__factory.abi = _abi;
    return ERC777TokensRecipient__factory;
}());
exports.ERC777TokensRecipient__factory = ERC777TokensRecipient__factory;
