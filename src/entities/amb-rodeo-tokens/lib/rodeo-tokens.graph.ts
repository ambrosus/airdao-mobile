import { gql } from '@apollo/client';

export const AMBRODEO_TOKENS = gql`
  query AmbrodeoTokens(
    $where: Token_filter = { onDex: true }
    $first: Int = 1000
    $orderBy: Token_orderBy = onDexSince
    $orderDirection: OrderDirection = desc
  ) {
    tokens(
      where: $where
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      data
      name
      symbol
    }
  }
`;

export const AMBRODEO_TOKEN = gql`
  query AmbrodeoToken($id: ID!) {
    token(id: $id) {
      id
      data
      name
      symbol
    }
  }
`;
