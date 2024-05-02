// import { AllowanceException, Network, Token } from './types';
// import { ethers } from 'ethers';
// import { BridgeSDK } from './index';

// class MySdk extends BridgeSDK {
//   getPairs(
//     sourceNetwork: Network,
//     destinationNetwork: Network
//   ): [Token, Token][] {
//     const result = super.getPairs(sourceNetwork, destinationNetwork);
//     return result.map(([from, to]) => [this.mapToken(from), this.mapToken(to)]);
//   }

//   mapToken(token: Token): Token {
//     // todo logos
//     // todo if isNativeCoin you can change name or symbol, for example:
//     //   use networkToken.nativeCoin (it's a symbol of native coin)
//     //   or create a mapping (networkName => {name, symbol, logo, ...}) for native coins

//     if (token.isNativeCoin) token.name += ' (NATIVE)';
//     return token;
//   }
// }

// async function main() {
//   const config = {
//     bridges: {
//       eth: {
//         amb: '0x19caBC1E34Ab0CC5C62DaA1394f6022B38b75c78',
//         side: '0x0De2669e8A7A6F6CC0cBD3Cf2D1EEaD89e243208'
//       },
//       bsc: {
//         amb: '0xe10eB55f6EeF66218BbE58B749428ec4A51D6659',
//         side: '0x92fa52d3043725D00Eab422440C4e9ef3ba180d3'
//       }
//     },
//     tokens: {
//       SAMB: {
//         isActive: true,
//         name: 'Synthetic Amber',
//         symbol: 'SAMB',
//         logo: 'https://media-exp1.licdn.com/dms/image/C560BAQFuR2Fncbgbtg/company-logo_200_200/0/1636390910839?e=2159024400&v=beta&t=W0WA5w02tIEH859mVypmzB_FPn29tS5JqTEYr4EYvps',
//         networks: {
//           amb: {
//             address: '0x2b2d892C3fe2b4113dd7aC0D2c1882AF202FB28F',
//             denomination: 18,
//             isPrimary: true,
//             nativeCoin: 'AMB'
//           },
//           bsc: {
//             address: '0x23c1C1cc14270B7Bd63677d1fe4790891b17A33d',
//             denomination: 18,
//             isPrimary: false
//           },
//           eth: {
//             address: '0x683aae5cD37AC94943D05C19E9109D5876113562',
//             denomination: 18,
//             isPrimary: false
//           }
//         }
//       },
//       SAMB2: {
//         isActive: true,
//         name: 'AirDAO',
//         symbol: 'AMB',
//         logo: 'https://media-exp1.licdn.com/dms/image/C560BAQFuR2Fncbgbtg/company-logo_200_200/0/1636390910839?e=2159024400&v=beta&t=W0WA5w02tIEH859mVypmzB_FPn29tS5JqTEYr4EYvps',
//         networks: {
//           amb: {
//             address: '0x2b2d892C3fe2b4113dd7aC0D2c1882AF202FB28F',
//             denomination: 18,
//             isPrimary: true,
//             nativeCoin: 'AMB'
//           },
//           bsc: {
//             address: '',
//             denomination: 18,
//             isPrimary: false
//           },
//           eth: {
//             address: '0xf4fB9BF10E489EA3Edb03E094939341399587b0C',
//             denomination: 18,
//             isPrimary: false
//           }
//         }
//       },
//       WETH: {
//         isActive: false,
//         name: 'Wrapped Ether',
//         symbol: 'WETH',
//         logo: 'https://ethereum.org/static/bfc04ac72981166c740b189463e1f74c/448ee/eth-diamond-black-white.webp',
//         networks: {
//           amb: {
//             address: '0xe7c3607474E235Ec8deF1f0a63Ea983538eea182',
//             denomination: 18,
//             isPrimary: false
//           },
//           eth: {
//             address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
//             denomination: 18,
//             isPrimary: true,
//             nativeCoin: 'ETH'
//           }
//         }
//       },
//       WBNB: {
//         isActive: false,
//         name: 'Wrapped BNB',
//         symbol: 'WBNB',
//         logo: 'https://bscscan.com/token/images/binance_32.png',
//         networks: {
//           amb: {
//             address: '0xA96C522fA8Df99BB73A6E317A1afb0E3FA13b735',
//             denomination: 18,
//             isPrimary: false
//           },
//           bsc: {
//             address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
//             denomination: 18,
//             isPrimary: true,
//             nativeCoin: 'BNB'
//           }
//         }
//       },
//       USDC: {
//         isActive: true,
//         name: 'USD Coin',
//         symbol: 'USDC',
//         logo: 'https://etherscan.io/token/images/centre-usdc_28.png',
//         networks: {
//           amb: {
//             address: '0xFF9F502976E7bD2b4901aD7Dd1131Bb81E5567de',
//             denomination: 18,
//             isPrimary: false
//           },
//           bsc: {
//             address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
//             denomination: 18,
//             isPrimary: true
//           },
//           eth: {
//             address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
//             denomination: 6,
//             isPrimary: true
//           }
//         }
//       },
//       BUSD: {
//         isActive: false,
//         name: 'BUSD Token',
//         symbol: 'BUSD',
//         logo: 'https://bscscan.com/token/images/busd_32.png',
//         networks: {
//           amb: {
//             address: '0x7A477aA8ED4884509387Dba81BA6F2B7C97597e2',
//             denomination: 18,
//             isPrimary: false
//           },
//           bsc: {
//             address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
//             denomination: 18,
//             isPrimary: true
//           }
//         }
//       },
//       USDT: {
//         isActive: true,
//         name: 'Tether USD',
//         symbol: 'USDT',
//         logo: 'https://etherscan.io/token/images/tether_32.png',
//         networks: {
//           amb: {
//             address: '0xfEE01F2D120250A0a59bfbF9C144F8ECC4425fCc',
//             denomination: 18,
//             isPrimary: false
//           },
//           bsc: {
//             address: '0x55d398326f99059fF775485246999027B3197955',
//             denomination: 18,
//             isPrimary: true
//           },
//           eth: {
//             address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
//             denomination: 6,
//             isPrimary: true
//           }
//         }
//       }
//     },
//     ambFaucetAddress: '0x5B72903b7D2711134DD2120Bc3CA61DB6f10cB92'
//   };

//   const providerAmb = new ethers.providers.JsonRpcProvider(
//     'https://network.ambrosus.io'
//   );
//   const providerEth = new ethers.providers.JsonRpcProvider(
//     'https://eth.llamarpc.com'
//   );
//   const providerBsc = new ethers.providers.JsonRpcProvider(
//     'https://bsc.llamarpc.com'
//   );

//   const signer = new ethers.Wallet(
//     '34d8e83fca265e9ab5bcc1094fa64e98692375bf8980d066a9edcf4953f0f2f5',
//     providerAmb
//   );

//   const sdk = new MySdk(config, {
//     relayUrls: {
//       eth: 'https://relay-eth.ambrosus.io/fees',
//       bsc: 'https://relay-bsc.ambrosus.io/fees'
//     }
//   });

//   };

// const ethAmb = {
//     name: "eth->amb",
//     pairs: sdk.getPairs("eth", "amb"),
//     provider: providerEth
// };

//   const ambEth = {
//     name: 'amb->eth',
//     pairs: sdk.getPairs('amb', 'eth'),
//     provider: providerAmb
//   };
//   const bscAmb = {
//     name: 'bsc->amb',
//     pairs: sdk.getPairs('bsc', 'amb'),
//     provider: providerBsc
//   };
//   const ambBsc = {
//     name: 'amb->bsc',
//     pairs: sdk.getPairs('amb', 'bsc'),
//     provider: providerAmb
//   };

//   for (const { name, pairs, provider } of [ethAmb, ambEth, bscAmb, ambBsc]) {
//     for (const [from, to] of pairs) {

//             console.log(name, from.name, "->", to.name)

//       const feeData = await sdk.getFeeData(from, to, '10000', true);

//       try {
//         await sdk.withdraw(
//           from,
//           to,
//           signer.address,
//           '10000',
//           feeData,
//           signer.connect(provider)
//         );
//       } catch (e) {
//         if (e instanceof AllowanceException) {
//           await sdk.setAllowance(e.token, signer, e.spenderAddress, e.amount);
//           // try again
//           await sdk.withdraw(
//             from,
//             to,
//             signer.address,
//             '10000',
//             feeData,
//             signer.connect(provider)
//           );
//         }
//         throw e;
//       }
//     }
//   }
// }

// /*
// example output:

// eth->amb Tether USD -> Tether USD
// Need to increase allowance to 10000000000
// bridge.withdraw(0xdAC17F958D2ee523a2206206994597C13D831ec7, 0x295C2707319ad4BecA6b5bb4086617fD6F240CfE, 10000000000, false, 0x5e28685708ed585c5c2347095809399ba38f57e845841fb0cdc81e4a646e889b0fc5487946c16b0008d9e43f3379458c7cf1561f039649fd3609f6342302183f01, 157499455173400, 0, { value: 157499455173400 })

// eth->amb USD Coin -> USD Coin
// Need to increase allowance to 10000000000
// bridge.withdraw(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0x295C2707319ad4BecA6b5bb4086617fD6F240CfE, 10000000000, false, 0x263aee2f3de81268912c8d191eb0726d5640cc3c8ddc09f1ea2a317a598c91a908ab04e0493cf7f6c4c993420018743393a9de6068bd264465e6a941b6725e9000, 157499455173400, 0, { value: 157499455173400 })

// eth->amb AirDAO -> AirDAO
// Need to increase allowance to 10000000000000000000000
// bridge.withdraw(0xf4fB9BF10E489EA3Edb03E094939341399587b0C, 0x295C2707319ad4BecA6b5bb4086617fD6F240CfE, 10000000000000000000000, false, 0x274bc5482ee3bbd04b9b9e0608980c661862d343e0d085af2402d9ac8ae072e75b83f6aa6f486bbb54fe0fc35235f948c208715726de281f28795f5da433b96800, 157499455173400, 0, { value: 157499455173400 })

// eth->amb AirDAO -> AirDAO (NATIVE)
// Need to increase allowance to 10000000000000000000000
// bridge.withdraw(0xf4fB9BF10E489EA3Edb03E094939341399587b0C, 0x295C2707319ad4BecA6b5bb4086617fD6F240CfE, 10000000000000000000000, true, 0x274bc5482ee3bbd04b9b9e0608980c661862d343e0d085af2402d9ac8ae072e75b83f6aa6f486bbb54fe0fc35235f948c208715726de281f28795f5da433b96800, 157499455173400, 0, { value: 157499455173400 })

// eth->amb Synthetic Amber -> Synthetic Amber
// Need to increase allowance to 10000000000000000000000
// bridge.withdraw(0x683aae5cD37AC94943D05C19E9109D5876113562, 0x295C2707319ad4BecA6b5bb4086617fD6F240CfE, 10000000000000000000000, false, 0x2fa60e7174e8e6d0d9112902923984e435934a064f2bc81de8e6e5e5717beed75a286ba22e0bf2397ff4b8cb8ac9f133346d34dd07fd3d47e48c422caf63656a00, 157499455173400, 0, { value: 157499455173400 })

// amb->eth Tether USD -> Tether USD
// Need to increase allowance to 10000000000000000000000
// bridge.withdraw(0xfEE01F2D120250A0a59bfbF9C144F8ECC4425fCc, 0x295C2707319ad4BecA6b5bb4086617fD6F240CfE, 10000000000, false, 0x3f1ebf8e5c861bd8e4d6f2a9f3b63e848b0e1b89875a794ec773de7e740160eb3887f9ebd76728e3127170ee024ea025d450fc6947afcb0086808f961e71930d01, 4699014836012654235617, 0, { value: 4699014836012654235617 })

// amb->eth USD Coin -> USD Coin
// Need to increase allowance to 10000000000000000000000
// bridge.withdraw(0xFF9F502976E7bD2b4901aD7Dd1131Bb81E5567de, 0x295C2707319ad4BecA6b5bb4086617fD6F240CfE, 10000000000, false, 0x16680b54c86f41990a398648cba17138f00b4a3bf4e47e457d19c79d9257ae6f2cf7dafaacfe29d38d7d0217be6d7cd63881c52f142b2345967cc697e92730af00, 4699014836012654235617, 0, { value: 4699014836012654235617 })

// amb->eth AirDAO -> AirDAO
// Need to increase allowance to 10000000000000000000000
// bridge.withdraw(0x2b2d892C3fe2b4113dd7aC0D2c1882AF202FB28F, 0x295C2707319ad4BecA6b5bb4086617fD6F240CfE, 10000000000000000000000, false, 0xdbd43702a6d2de8e97c2359f66529be39976fb2f7f4ff0a7032b7dd5cacd3c7c50e308b4baac6dd5bdd6c35e2b18fc21b27159ef21adfbbee47e003babe02a8b00, 4699014836012654235617, 0, { value: 4699014836012654235617 })

// amb->eth AirDAO (NATIVE) -> AirDAO
// bridge.wrapWithdraw(0x295C2707319ad4BecA6b5bb4086617fD6F240CfE, 0xdbd43702a6d2de8e97c2359f66529be39976fb2f7f4ff0a7032b7dd5cacd3c7c50e308b4baac6dd5bdd6c35e2b18fc21b27159ef21adfbbee47e003babe02a8b00, 4699014836012654235617, 0, { value: 14699014836012654235617 })

// amb->eth Synthetic Amber -> Synthetic Amber
// Need to increase allowance to 10000000000000000000000
// bridge.withdraw(0x2b2d892C3fe2b4113dd7aC0D2c1882AF202FB28F, 0x295C2707319ad4BecA6b5bb4086617fD6F240CfE, 10000000000000000000000, false, 0xdbd43702a6d2de8e97c2359f66529be39976fb2f7f4ff0a7032b7dd5cacd3c7c50e308b4baac6dd5bdd6c35e2b18fc21b27159ef21adfbbee47e003babe02a8b00, 4699014836012654235617, 0, { value: 4699014836012654235617 })

// bsc->amb Tether USD -> Tether USD
// Need to increase allowance to 10000000000000000000000
// bridge.withdraw(0x55d398326f99059fF775485246999027B3197955, 0x295C2707319ad4BecA6b5bb4086617fD6F240CfE, 10000000000000000000000, false, 0x4d741171fe8130a32d1571f7a242683874a3e9ef77f07551117ed74312b582b651873ea4abfe35a21a9f8aed18a2ca03c44a7a2fd754e671580fef20b4f96f8300, 843537161377815, 0, { value: 843537161377815 })

// bsc->amb USD Coin -> USD Coin
// Need to increase allowance to 10000000000000000000000
// bridge.withdraw(0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d, 0x295C2707319ad4BecA6b5bb4086617fD6F240CfE, 10000000000000000000000, false, 0xd2b0038e61ea64c623e3a5be99bcd217a2d9a6b003666a989aa4a8a243c085c122c0c5e346688346a76a18374e7d1e2c688920c37d944588eb6899f2572fd2b101, 843537161377815, 0, { value: 843537161377815 })

// bsc->amb Synthetic Amber -> Synthetic Amber
// Need to increase allowance to 10000000000000000000000
// bridge.withdraw(0x23c1C1cc14270B7Bd63677d1fe4790891b17A33d, 0x295C2707319ad4BecA6b5bb4086617fD6F240CfE, 10000000000000000000000, false, 0x1ccb8a6e7fabd61970e69da899c0d619acdc614e90a5bcfcf1bc470fac9be8295f60ccc2111d391fe5eee5f902a2bdef50a7027bd5fbb75c6ea312cf1ae57a5701, 843537161377815, 0, { value: 843537161377815 })

// bsc->amb Synthetic Amber -> Synthetic Amber (NATIVE)
// Need to increase allowance to 10000000000000000000000
// bridge.withdraw(0x23c1C1cc14270B7Bd63677d1fe4790891b17A33d, 0x295C2707319ad4BecA6b5bb4086617fD6F240CfE, 10000000000000000000000, true, 0x1ccb8a6e7fabd61970e69da899c0d619acdc614e90a5bcfcf1bc470fac9be8295f60ccc2111d391fe5eee5f902a2bdef50a7027bd5fbb75c6ea312cf1ae57a5701, 843537161377815, 0, { value: 843537161377815 })

// amb->bsc Tether USD -> Tether USD
// Need to increase allowance to 10000000000000000000000
// bridge.withdraw(0xfEE01F2D120250A0a59bfbF9C144F8ECC4425fCc, 0x295C2707319ad4BecA6b5bb4086617fD6F240CfE, 10000000000000000000000, false, 0x66e1ac47eaab81b76c630c1d9b70015c63c0c57ff068f7186c28f2eb53e5a0de0521fc9af4d7227024a3b157b3a54ab4fbeb94d481d66baa12afc2d24fb2328a00, 120675531973947600754, 0, { value: 120675531973947600754 })

// amb->bsc USD Coin -> USD Coin
// Need to increase allowance to 10000000000000000000000
// bridge.withdraw(0xFF9F502976E7bD2b4901aD7Dd1131Bb81E5567de, 0x295C2707319ad4BecA6b5bb4086617fD6F240CfE, 10000000000000000000000, false, 0x7e4e9dac82189346575c4a7b0541812f899b3e638340448a34c294872782bcf04894d8d29a1fb0ed54745722aee1ad31850f5379b22e8e02e284fcc24d79a5d700, 120675531973947600754, 0, { value: 120675531973947600754 })

// amb->bsc Synthetic Amber -> Synthetic Amber
// Need to increase allowance to 10000000000000000000000
// bridge.withdraw(0x2b2d892C3fe2b4113dd7aC0D2c1882AF202FB28F, 0x295C2707319ad4BecA6b5bb4086617fD6F240CfE, 10000000000000000000000, false, 0x83be964d6c72871b8a590ac0df32d2c77c0eb7ea831edb6aa8716110a29ada7e65afb03723d7ef77b6f0ef11659fcf01678881f6c40dcad7dcc2f5f4b6c19d2001, 120675531973947600754, 0, { value: 120675531973947600754 })

// amb->bsc Synthetic Amber (NATIVE) -> Synthetic Amber
// bridge.wrapWithdraw(0x295C2707319ad4BecA6b5bb4086617fD6F240CfE, 0x83be964d6c72871b8a590ac0df32d2c77c0eb7ea831edb6aa8716110a29ada7e65afb03723d7ef77b6f0ef11659fcf01678881f6c40dcad7dcc2f5f4b6c19d2001, 120675531973947600754, 0, { value: 10120675531973947600754 })

//  */
