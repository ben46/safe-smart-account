"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FallbackManager__factory = void 0;
var ethers_1 = require("ethers");
var _abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "handler",
                type: "address",
            },
        ],
        name: "ChangedFallbackHandler",
        type: "event",
    },
    {
        stateMutability: "nonpayable",
        type: "fallback",
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
var FallbackManager__factory = /** @class */ (function () {
    function FallbackManager__factory() {
    }
    FallbackManager__factory.createInterface = function () {
        return new ethers_1.utils.Interface(_abi);
    };
    FallbackManager__factory.connect = function (address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    };
    FallbackManager__factory.abi = _abi;
    return FallbackManager__factory;
}());
exports.FallbackManager__factory = FallbackManager__factory;
