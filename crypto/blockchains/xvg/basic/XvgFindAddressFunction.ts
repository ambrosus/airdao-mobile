import BlocksoftBN from '../../../common/AirDAOBN';

interface TransactionIO {
  address: string;
  value: string;
  direction: 'income' | 'outcome' | 'self';
}

interface TransactionSummary {
  direction: 'income' | 'outcome' | 'self';
  inputAddresses: string[];
  outputAddresses: string[];
  value: string;
}

export default async function XvgFindAddressFunction(
  targetAddress: string,
  txIO: { inputs: TransactionIO[]; outputs: TransactionIO[] }
): Promise<TransactionSummary> {
  const inputFromOthersBN = new BlocksoftBN(0);
  const inputFromTargetBN = new BlocksoftBN(0);
  const inputFromOthersAddresses: string[] = [];
  const uniqueInputAddresses: Record<string, number> = {};

  let input: TransactionIO;
  for (input of txIO.inputs) {
    if (input.address) {
      if (input.address === targetAddress) {
        inputFromTargetBN.add(input.value);
      } else {
        if (typeof uniqueInputAddresses[input.address] === 'undefined') {
          uniqueInputAddresses[input.address] = 1;
          inputFromOthersAddresses.push(input.address);
        }
        inputFromOthersBN.add(input.value);
      }
    }
  }

  const outputToOthersBN = new BlocksoftBN(0);
  const outputToTargetBN = new BlocksoftBN(0);
  const outputToOthersAddresses: string[] = [];
  const uniqueOutputAddresses: Record<string, number> = {};

  let output: TransactionIO;
  for (output of txIO.outputs) {
    if (output.address) {
      if (output.address === targetAddress) {
        outputToTargetBN.add(output.value);
      } else {
        if (typeof uniqueOutputAddresses[output.address] === 'undefined') {
          uniqueOutputAddresses[output.address] = 1;
          outputToOthersAddresses.push(output.address);
        }
        outputToOthersBN.add(output.value);
      }
    }
  }

  if (inputFromTargetBN.get() === '0') {
    // target only in output
    return {
      direction: 'income',
      inputAddresses: inputFromOthersAddresses,
      outputAddresses: [],
      value: outputToTargetBN.get()
    };
  } else if (outputToTargetBN.get() === '0') {
    // target only in input
    return {
      direction: 'outcome',
      inputAddresses: [],
      outputAddresses: outputToOthersAddresses,
      value:
        inputFromOthersBN.get() === '0'
          ? outputToOthersBN.get()
          : inputFromTargetBN.get()
    };
  } else {
    // both input and output
    if (outputToOthersAddresses.length > 0) {
      // there are other addresses
      return {
        direction: 'outcome',
        inputAddresses: [],
        outputAddresses: outputToOthersAddresses,
        value: outputToOthersBN.get()
      };
    } else {
      return {
        direction: 'self',
        inputAddresses: [],
        outputAddresses: [],
        value: inputFromTargetBN.diff(outputToTargetBN).get()
      };
    }
  }
}
