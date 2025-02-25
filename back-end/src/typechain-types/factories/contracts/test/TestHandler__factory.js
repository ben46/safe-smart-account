"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestHandler__factory = void 0;
var ethers_1 = require("ethers");
var _abi = [
    {
        inputs: [],
        name: "dudududu",
        outputs: [
            {
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                internalType: "address",
                name: "manager",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];
var TestHandler__factory = /** @class */ (function () {
    function TestHandler__factory() {
    }
    TestHandler__factory.createInterface = function () {
        return new ethers_1.utils.Interface(_abi);
    };
    TestHandler__factory.connect = function (address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    };
    TestHandler__factory.abi = _abi;
    return TestHandler__factory;
}());
exports.TestHandler__factory = TestHandler__factory;
