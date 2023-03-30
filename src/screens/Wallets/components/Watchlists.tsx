import React from 'react';
import { Wallet, WalletList } from '@components/templates';

export function Watchlists(): JSX.Element {
  const wallets: Wallet[] = [
    {
      title: 'Wallet 1',
      price: 20,
      currency: 'AMB',
      last24HourChange: 3.46,
      totalAmount: 45000
    },
    {
      title: 'Wallet 1',
      price: 20,
      currency: 'AMB',
      last24HourChange: 3.46,
      totalAmount: 45000
    },
    {
      title: 'Wallet 1',
      price: 20,
      currency: 'AMB',
      last24HourChange: 3.46,
      totalAmount: 45000
    },
    {
      title: 'Wallet 1',
      price: 20,
      currency: 'AMB',
      last24HourChange: 3.46,
      totalAmount: 45000
    },
    {
      title: 'Wallet 1',
      price: 20,
      currency: 'AMB',
      last24HourChange: 3.46,
      totalAmount: 45000
    },
    {
      title: 'Wallet 1',
      price: 20,
      currency: 'AMB',
      last24HourChange: 3.46,
      totalAmount: 45000
    },
    {
      title: 'Wallet 1',
      price: 20,
      currency: 'AMB',
      last24HourChange: 3.46,
      totalAmount: 45000
    }
  ];

  return <WalletList title="Watchlists" totalAmount={1200000} data={wallets} />;
}
