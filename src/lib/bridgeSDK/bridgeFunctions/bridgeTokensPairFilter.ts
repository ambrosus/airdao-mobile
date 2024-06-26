import Config from '@constants/config';
import { Token } from '@lib/bridgeSDK/models/types';

interface BridgeTokensPairBuilderModel {
  pair: Token[];
  bridgePairName: string;
}

// amb->eth/bsc:
// we show only native AMB token (SAMB_IN_AMB isNative:true)
// if we send wrap token (WBNB, WETH) we always do unwrap

// eth/bsc->amb:
// we send only to native AMB token (SAMB_IN_AMB isNative:true)
// if we can unwrap token we always do it

export const bridgeTokensPairFilter = ({
  pair,
  bridgePairName
}: BridgeTokensPairBuilderModel) => {
  const [from, to] = pair;
  const {
    SAMB_IN_AMB,
    SAMB_IN_ETH,
    SAMB2_IN_ETH,
    WETH_IN_ETH,
    SAMB_IN_BSC,
    WNBN_IN_BSC
  } = Config;

  const fromIsSAMBinAMB = from.address === SAMB_IN_AMB && !from.isNativeCoin;
  const fromIsSAMBinETH = from.address === SAMB_IN_ETH;
  const fromIsSAMBinBSC = from.address === SAMB_IN_BSC;

  const toIsSAMBinETH = to.address === SAMB_IN_ETH;
  const toIsSAMB2InETH = to.address === SAMB2_IN_ETH;
  const toIsWETHinETH = to.address === WETH_IN_ETH && !to.isNativeCoin;
  const toIsSAMBinAMB = to.address === SAMB_IN_AMB && !to.isNativeCoin;
  const toIsWBNBinBSC = to.address === WNBN_IN_BSC && !to.isNativeCoin;
  const toIsNativeAMBinAMB = to.address === SAMB_IN_AMB && to.isNativeCoin;
  const toIsSAMBInBSC = to.address === SAMB_IN_BSC;
  switch (bridgePairName) {
    case 'amb->eth': {
      // hide pairs
      // 'AMB_SAMB->ETH_SAMB'
      // 'AMB_SAMB->ETH_SAMB2'
      // 'AMB_WETH->ETH_WETH'
      return !(
        (fromIsSAMBinAMB && toIsSAMBinETH) ||
        (fromIsSAMBinAMB && toIsSAMB2InETH) ||
        toIsWETHinETH
      );
    }

    case 'amb->bsc': {
      // hide pairs
      // 'AMB_SAMB -> BSC_SAMB' 'AMB_WBNB -> BSC_WBNB
      return !((fromIsSAMBinAMB && toIsSAMBInBSC) || toIsWBNBinBSC);
    }

    case 'eth->amb': {
      // hide pairs
      // 'ETH_SAMB->AMB_SAMB' 'ETH_SMB2->AMB_SAMB
      return !(fromIsSAMBinETH || toIsSAMBinAMB);
    }

    case 'bsc->amb':
      // hide pair 'BSC_SAMB->AMB_SAMB'
      return !(fromIsSAMBinBSC && !toIsNativeAMBinAMB);
    default:
      return true;
  }
};
