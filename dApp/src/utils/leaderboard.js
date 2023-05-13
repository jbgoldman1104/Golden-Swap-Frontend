// import { unatomic } from "./util";
// const Web3 = require("web3");
// const web3 = new Web3(
//   new Web3.providers.HttpProvider(
//     "https://data-seed-prebsc-1-s1.binance.org:8545/"
//   )
// );

// const address = "0x127e3d87f2305213bc7404e46c5a5549e8f9b74f";

// const abi = [
//   { inputs: [], stateMutability: "nonpayable", type: "constructor" },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "owner",
//         type: "address",
//       },
//       {
//         indexed: true,
//         internalType: "address",
//         name: "spender",
//         type: "address",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "value",
//         type: "uint256",
//       },
//     ],
//     name: "Approval",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "account",
//         type: "address",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "duration",
//         type: "uint256",
//       },
//     ],
//     name: "EnableAccountStaking",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: false, internalType: "bool", name: "enabled", type: "bool" },
//     ],
//     name: "EnableStaking",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: false, internalType: "bool", name: "enabled", type: "bool" },
//     ],
//     name: "EnableSwapAndLiquify",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "account",
//         type: "address",
//       },
//       {
//         indexed: false,
//         internalType: "bool",
//         name: "isExcluded",
//         type: "bool",
//       },
//     ],
//     name: "ExcludeFromFees",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "uint256",
//         name: "newValue",
//         type: "uint256",
//       },
//       {
//         indexed: true,
//         internalType: "uint256",
//         name: "oldValue",
//         type: "uint256",
//       },
//     ],
//     name: "GasForProcessingUpdated",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: false,
//         internalType: "uint8",
//         name: "leaderboardCase",
//         type: "uint8",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "entryCount",
//         type: "uint256",
//       },
//     ],
//     name: "LeaderboardCompletion",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "newLiquidityWallet",
//         type: "address",
//       },
//       {
//         indexed: true,
//         internalType: "address",
//         name: "oldLiquidityWallet",
//         type: "address",
//       },
//     ],
//     name: "LiquidityWalletUpdated",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "previousOwner",
//         type: "address",
//       },
//       {
//         indexed: true,
//         internalType: "address",
//         name: "newOwner",
//         type: "address",
//       },
//     ],
//     name: "OwnershipTransferred",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "iterations",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "claims",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "lastProcessedIndex",
//         type: "uint256",
//       },
//       {
//         indexed: true,
//         internalType: "bool",
//         name: "automatic",
//         type: "bool",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "gas",
//         type: "uint256",
//       },
//       {
//         indexed: true,
//         internalType: "address",
//         name: "processor",
//         type: "address",
//       },
//     ],
//     name: "ProcessedDividendTracker",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, internalType: "address", name: "by", type: "address" },
//       { indexed: true, internalType: "address", name: "to", type: "address" },
//       {
//         indexed: true,
//         internalType: "uint256",
//         name: "amount",
//         type: "uint256",
//       },
//     ],
//     name: "ReferralRewards",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, internalType: "address", name: "by", type: "address" },
//       {
//         indexed: true,
//         internalType: "address",
//         name: "Referrer",
//         type: "address",
//       },
//     ],
//     name: "ReferredBy",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "amount",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "opAmount",
//         type: "uint256",
//       },
//       { indexed: false, internalType: "bool", name: "success", type: "bool" },
//     ],
//     name: "SendDividends",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "pair",
//         type: "address",
//       },
//       { indexed: true, internalType: "bool", name: "value", type: "bool" },
//     ],
//     name: "SetAutomatedMarketMakerPair",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: false,
//         internalType: "address",
//         name: "wallet",
//         type: "address",
//       },
//     ],
//     name: "SetPreSaleWallet",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "tokensSwapped",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "ethReceived",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "tokensIntoLiqudity",
//         type: "uint256",
//       },
//     ],
//     name: "SwapAndLiquify",
//     type: "event",
//   },
//   { anonymous: false, inputs: [], name: "TradingEnabled", type: "event" },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "from",
//         type: "address",
//       },
//       { indexed: true, internalType: "address", name: "to", type: "address" },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "value",
//         type: "uint256",
//       },
//     ],
//     name: "Transfer",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: false,
//         internalType: "address",
//         name: "token",
//         type: "address",
//       },
//       { indexed: false, internalType: "bool", name: "allow", type: "bool" },
//     ],
//     name: "UpdateAllowTokens",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "newAddress",
//         type: "address",
//       },
//       {
//         indexed: true,
//         internalType: "address",
//         name: "oldAddress",
//         type: "address",
//       },
//     ],
//     name: "UpdateDividendTracker",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "dev",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "liquidity",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "BNBRewardsBuy",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "BNBRewardsSell",
//         type: "uint256",
//       },
//     ],
//     name: "UpdateFees",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: false,
//         internalType: "address",
//         name: "account",
//         type: "address",
//       },
//       {
//         indexed: false,
//         internalType: "address",
//         name: "token",
//         type: "address",
//       },
//     ],
//     name: "UpdatePayoutToken",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "duration",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "amount",
//         type: "uint256",
//       },
//     ],
//     name: "UpdateStakingAmounts",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "newAddress",
//         type: "address",
//       },
//       {
//         indexed: true,
//         internalType: "address",
//         name: "oldAddress",
//         type: "address",
//       },
//     ],
//     name: "UpdateUniswapV2Router",
//     type: "event",
//   },
//   {
//     inputs: [],
//     name: "BNBRewardsBuyFee",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "BNBRewardsSellFee",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "address", name: "owner", type: "address" },
//       { internalType: "address", name: "spender", type: "address" },
//     ],
//     name: "allowance",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "address", name: "spender", type: "address" },
//       { internalType: "uint256", name: "amount", type: "uint256" },
//     ],
//     name: "approve",
//     outputs: [{ internalType: "bool", name: "", type: "bool" }],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "", type: "address" }],
//     name: "automatedMarketMakerPairs",
//     outputs: [{ internalType: "bool", name: "", type: "bool" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "account", type: "address" }],
//     name: "balanceOf",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "buyAmount",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "claim",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "", type: "address" }],
//     name: "convertReferralRewards",
//     outputs: [{ internalType: "bool", name: "", type: "bool" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "decimals",
//     outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "address", name: "spender", type: "address" },
//       { internalType: "uint256", name: "subtractedValue", type: "uint256" },
//     ],
//     name: "decreaseAllowance",
//     outputs: [{ internalType: "bool", name: "", type: "bool" }],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "devFees",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "account", type: "address" }],
//     name: "dividendTokenBalanceOf",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "dividendTracker",
//     outputs: [
//       {
//         internalType: "contract DogeDealerDividendTracker",
//         name: "",
//         type: "address",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "bool", name: "enable", type: "bool" }],
//     name: "enableStaking",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "bool", name: "enabled", type: "bool" }],
//     name: "enableSwapAndLiquify",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "enableTrading",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "address", name: "account", type: "address" },
//       { internalType: "bool", name: "excluded", type: "bool" },
//     ],
//     name: "excludeFromFees",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "forceStartTradingAt",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "uint256", name: "tokens", type: "uint256" }],
//     name: "forceSwapAndSendDividends",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "gasForProcessing",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "account", type: "address" }],
//     name: "getAccountDividendsInfo",
//     outputs: [
//       { internalType: "address", name: "", type: "address" },
//       { internalType: "int256", name: "", type: "int256" },
//       { internalType: "int256", name: "", type: "int256" },
//       { internalType: "uint256", name: "", type: "uint256" },
//       { internalType: "uint256", name: "", type: "uint256" },
//       { internalType: "uint256", name: "", type: "uint256" },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
//     name: "getAccountDividendsInfoAtIndex",
//     outputs: [
//       { internalType: "address", name: "", type: "address" },
//       { internalType: "int256", name: "", type: "int256" },
//       { internalType: "int256", name: "", type: "int256" },
//       { internalType: "uint256", name: "", type: "uint256" },
//       { internalType: "uint256", name: "", type: "uint256" },
//       { internalType: "uint256", name: "", type: "uint256" },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "token", type: "address" }],
//     name: "getAllowTokens",
//     outputs: [{ internalType: "bool", name: "", type: "bool" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "getETHBalance",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "getLastProcessedIndex",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "getNativeBalance",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "getNumberOfDividendTokenHolders",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "account", type: "address" }],
//     name: "getPayoutToken",
//     outputs: [{ internalType: "address", name: "", type: "address" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "address", name: "account", type: "address" },
//       { internalType: "uint8", name: "leaderboardCase", type: "uint8" },
//     ],
//     name: "getReferralCounts",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "uint256", name: "index", type: "uint256" },
//       { internalType: "uint8", name: "leaderboardCase", type: "uint8" },
//     ],
//     name: "getReferralCountsAtUnsortedIndex",
//     outputs: [
//       { internalType: "address", name: "", type: "address" },
//       { internalType: "uint256", name: "", type: "uint256" },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "address", name: "account", type: "address" },
//       { internalType: "uint8", name: "leaderboardCase", type: "uint8" },
//     ],
//     name: "getReferralEarnings",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "getReferralLeaderboardTimers",
//     outputs: [
//       { internalType: "uint256", name: "", type: "uint256" },
//       { internalType: "uint256", name: "", type: "uint256" },
//       { internalType: "uint256", name: "", type: "uint256" },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "uint256", name: "index", type: "uint256" },
//       { internalType: "uint8", name: "leaderboardCase", type: "uint8" },
//     ],
//     name: "getReferralStatsAtUnsortedIndex",
//     outputs: [
//       { internalType: "address", name: "", type: "address" },
//       { internalType: "uint256", name: "", type: "uint256" },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "getReferralStatsIndexLength",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "getReferrer",
//     outputs: [{ internalType: "address", name: "", type: "address" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "account", type: "address" }],
//     name: "getStakingInfo",
//     outputs: [
//       { internalType: "uint256", name: "", type: "uint256" },
//       { internalType: "uint256", name: "", type: "uint256" },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "getTotalDividendsDistributed",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "address", name: "spender", type: "address" },
//       { internalType: "uint256", name: "addedValue", type: "uint256" },
//     ],
//     name: "increaseAllowance",
//     outputs: [{ internalType: "bool", name: "", type: "bool" }],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "account", type: "address" }],
//     name: "isExcludedFromAutoClaim",
//     outputs: [{ internalType: "bool", name: "", type: "bool" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "account", type: "address" }],
//     name: "isExcludedFromFees",
//     outputs: [{ internalType: "bool", name: "", type: "bool" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "account", type: "address" }],
//     name: "isPrivateSaleWallet",
//     outputs: [{ internalType: "bool", name: "", type: "bool" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "account", type: "address" }],
//     name: "isReinvest",
//     outputs: [{ internalType: "bool", name: "", type: "bool" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "liquidityFee",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "liquidityWallet",
//     outputs: [{ internalType: "address", name: "", type: "address" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "marketingAddress",
//     outputs: [{ internalType: "address payable", name: "", type: "address" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "maxSellTransactionAmount",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "name",
//     outputs: [{ internalType: "string", name: "", type: "string" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "owner",
//     outputs: [{ internalType: "address", name: "", type: "address" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "", type: "address" }],
//     name: "privateSaleWallet",
//     outputs: [{ internalType: "bool", name: "", type: "bool" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "uint256", name: "gas", type: "uint256" }],
//     name: "processDividendTracker",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     name: "referralAccounts",
//     outputs: [{ internalType: "address", name: "", type: "address" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "", type: "address" }],
//     name: "referralCount",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "", type: "address" }],
//     name: "referralCountDaily",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "", type: "address" }],
//     name: "referralCountMonthly",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "", type: "address" }],
//     name: "referralCountWeekly",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "", type: "address" }],
//     name: "referralEarnings",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "", type: "address" }],
//     name: "referralEarningsDaily",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "", type: "address" }],
//     name: "referralEarningsMonthly",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "", type: "address" }],
//     name: "referralEarningsWeekly",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "referralFee",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "", type: "address" }],
//     name: "referrers",
//     outputs: [{ internalType: "address", name: "", type: "address" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "renounceOwnership",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "sellAmount",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "bool", name: "allow", type: "bool" }],
//     name: "setAllowAutoReinvest",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "bool", name: "allow", type: "bool" }],
//     name: "setAllowCustomTokens",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "bool", name: "value", type: "bool" }],
//     name: "setAutoClaim",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "address", name: "pair", type: "address" },
//       { internalType: "bool", name: "value", type: "bool" },
//     ],
//     name: "setAutomatedMarketMakerPair",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "bool", name: "convert", type: "bool" }],
//     name: "setConvertReferralRewards",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "bool", name: "value", type: "bool" }],
//     name: "setDividendsPaused",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "address payable",
//         name: "newAddress",
//         type: "address",
//       },
//     ],
//     name: "setMarketingAddress",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "wallet", type: "address" }],
//     name: "setPresaleWallet",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "address", name: "account", type: "address" },
//       { internalType: "bool", name: "status", type: "bool" },
//     ],
//     name: "setPrivateSaleWallet",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "_referrer", type: "address" }],
//     name: "setReferrer",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "bool", name: "value", type: "bool" }],
//     name: "setReinvest",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
//     name: "setSwapTokensAmount",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "uint256", name: "duration", type: "uint256" }],
//     name: "stake",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     name: "stakingAmounts",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "", type: "address" }],
//     name: "stakingBonus",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "", type: "address" }],
//     name: "stakingUntilDate",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "swapTokensAtAmount",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "symbol",
//     outputs: [{ internalType: "string", name: "", type: "string" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "totalSupply",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "tradingEnabled",
//     outputs: [{ internalType: "bool", name: "", type: "bool" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "address", name: "recipient", type: "address" },
//       { internalType: "uint256", name: "amount", type: "uint256" },
//     ],
//     name: "transfer",
//     outputs: [{ internalType: "bool", name: "", type: "bool" }],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "address", name: "tokenAddress", type: "address" },
//       { internalType: "uint256", name: "amount", type: "uint256" },
//       { internalType: "address", name: "destination", type: "address" },
//     ],
//     name: "transferERC20Token",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "address", name: "destination", type: "address" },
//       { internalType: "uint256", name: "bnb", type: "uint256" },
//     ],
//     name: "transferETH",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "address", name: "sender", type: "address" },
//       { internalType: "address", name: "recipient", type: "address" },
//       { internalType: "uint256", name: "amount", type: "uint256" },
//     ],
//     name: "transferFrom",
//     outputs: [{ internalType: "bool", name: "", type: "bool" }],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
//     name: "transferOwnership",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "uniswapV2Pair",
//     outputs: [{ internalType: "address", name: "", type: "address" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "uniswapV2Router",
//     outputs: [
//       {
//         internalType: "contract IUniswapV2Router02",
//         name: "",
//         type: "address",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "address", name: "token", type: "address" },
//       { internalType: "bool", name: "allow", type: "bool" },
//     ],
//     name: "updateAllowTokens",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "newAddress", type: "address" }],
//     name: "updateDividendTracker",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "uint256", name: "dev", type: "uint256" },
//       { internalType: "uint256", name: "liquidity", type: "uint256" },
//       { internalType: "uint256", name: "BNBRewardsBuy", type: "uint256" },
//       { internalType: "uint256", name: "BNBRewardsSell", type: "uint256" },
//       { internalType: "uint256", name: "referral", type: "uint256" },
//     ],
//     name: "updateFees",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "uint256", name: "newValue", type: "uint256" }],
//     name: "updateGasForProcessing",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "address",
//         name: "newLiquidityWallet",
//         type: "address",
//       },
//     ],
//     name: "updateLiquidityWallet",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "uint256", name: "newNum", type: "uint256" }],
//     name: "updateMaxAmount",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "token", type: "address" }],
//     name: "updatePayoutToken",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "uint256", name: "duration", type: "uint256" },
//       { internalType: "uint256", name: "bonus", type: "uint256" },
//     ],
//     name: "updateStakingAmounts",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "newAddress", type: "address" }],
//     name: "updateUniswapV2Router",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "account", type: "address" }],
//     name: "withdrawableDividendOf",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   { stateMutability: "payable", type: "receive" },
// ];
// export async function test() {
//   const contract = new web3.eth.Contract(abi, address);

//   const length = await contract.methods.getReferralStatsIndexLength().call();

//   const allTime = [];
//   const daily = [];
//   const weekly = [];
//   const monthly = [];

//   for (let i = 0; i <= 3; i++) {
//     if (i === 0) {
//       for (let j = 0; j <= length - 1; j++) {
//         const temp = await contract.methods
//           .getReferralStatsAtUnsortedIndex(j, i)
//           .call();
//         temp[1] = unatomic(temp[1], 9);
//         temp[2] = await contract.methods.getReferralCounts(temp[0], i).call();
//         allTime.push(temp);
//         //console.log(allTime[j]);
//       }
//     }
//     if (i === 1) {
//       for (let j = 0; j <= length - 1; j++) {
//         const temp = await contract.methods
//           .getReferralStatsAtUnsortedIndex(j, i)
//           .call();
//         temp[1] = unatomic(temp[1], 9);
//         temp[2] = await contract.methods.getReferralCounts(temp[0], i).call();
//         daily.push(temp);
//       }
//     }
//     if (i === 2) {
//       for (let j = 0; j <= length - 1; j++) {
//         const temp = await contract.methods
//           .getReferralStatsAtUnsortedIndex(j, i)
//           .call();
//         temp[1] = unatomic(temp[1], 9);
//         temp[2] = await contract.methods.getReferralCounts(temp[0], i).call();
//         weekly.push(temp);
//       }
//     }
//     if (i === 3) {
//       for (let j = 0; j <= length - 1; j++) {
//         const temp = await contract.methods
//           .getReferralStatsAtUnsortedIndex(j, i)
//           .call();
//         temp[1] = unatomic(temp[1], 9);
//         temp[2] = await contract.methods.getReferralCounts(temp[0], i).call();
//         monthly.push(temp);
//       }
//     }
//   }
//   return { allTime, daily, weekly, monthly };
// }

// export async function referals(account) {
//   const contract = new web3.eth.Contract(abi, address);

//   const count = await contract.methods.referralCount(account).call();

//   const referrers = [];

//   for (let i = 0; i < count; i++) {
//     referrers.push(await contract.methods.referralAccounts(i).call());
//   }

//   return referrers;
// }
