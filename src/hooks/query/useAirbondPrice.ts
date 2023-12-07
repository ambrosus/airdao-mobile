import Web3 from 'web3';
import { useQuery } from '@tanstack/react-query';
import { QueryResponse } from '@appTypes/QueryResponse';

export function useAirbondPrice(): QueryResponse<any> {
  const { data, isLoading, isRefetching, error, refetch } = useQuery<any>(
    ['airbond-token'],
    async () => {
      const web3 = new Web3(
        new Web3.providers.HttpProvider('https://network.ambrosus.io')
      );
      const ROUTER_ABI = [
        {
          type: 'function',
          name: 'getAmountsOut',
          inputs: [
            { name: 'amountIn', type: 'uint256' },
            { name: 'path', type: 'address[]' }
          ],
          outputs: [{ name: 'amounts', type: 'uint256[]' }]
        }
      ];

      const ROUTER_ADDRESS = '0xC54007213080526139d38eAe66777dFac413772C';
      const airBondAddress = '0x096B5914C95C34Df19500DAff77470C845EC749D';
      const sambAddress = '0x2b2d892C3fe2b4113dd7aC0D2c1882AF202FB28F';
      //@ts-ignore
      const routerContract = new web3.eth.Contract(ROUTER_ABI, ROUTER_ADDRESS);

      const path = [airBondAddress, sambAddress];

      // Convert 1 Ether to Wei (as BigNumber)
      const bnOne = web3.utils.toWei('1', 'ether');

      try {
        // Calling the smart contract method
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, airbondPrice] = await routerContract.methods
          .getAmountsOut(bnOne, path)
          .call();
        // Convert the amount from Wei to Ether and log it
        return web3.utils.fromWei(airbondPrice, 'ether');
      } catch (error) {
        throw error;
      }
    }
  );

  return {
    data,
    loading: isLoading,
    refetching: isRefetching,
    error,
    refetch
  };
}
