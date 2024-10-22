export enum CustomAppEvents {
  // add wallet action compeate
  main_add_wallet = 'main_add_wallet',
  // open qr code screen
  main_scan = 'main_scan',

  // main_${event}  go to main section screen from home screen
  // ${event}_start start of sign tx process
  // ${event}_finish tx is signed
  // ${event}_error error
  main_swap = 'main_swap',
  swap_start = 'swap_start',
  swap_finish = 'swap_finish',
  swap_error = 'swap_error',

  main_send = 'main_send',
  send_start = 'send_start',
  send_finish = 'send_finish',
  send_error = 'send_error',

  main_stake = 'main_stake',
  stake_start = 'stake_start',
  stake_finish = 'stake_finish',
  stake_error = 'stake_error',

  withdraw_start = 'withdraw_start',
  withdraw_finish = 'withdraw_finish',
  withdraw_error = 'withdraw_error',

  main_bridge = 'main_bridge',
  bridge_start = 'bridge_start',
  bridge_finish = 'bridge_finish',
  bridge_error = 'bridge_error',

  main_kosmos = 'main_kosmos',
  kosmos_market_open = 'kosmos_market_open',
  kosmos_market_buy = 'kosmos_market_buy',
  kosmos_claim = 'kosmos_claim',

  watchlist_page = 'watchlist_page',
  watchlist_address_added = 'watchlist_address_added',
  watchlist_group_created = 'watchlist_group_created',
  watchlist_group_removed = 'watchlist_group_removed',
  watchlist_address_group_added = 'watchlist_address_group_added',

  explorer_page = 'explorer_page',
  explorer_address_open = 'explorer_address_open',
  explorer_search = 'explorer_search',
  explorer_address_watchlist_added = 'explorer_address_watchlist_added',
  explorer_address_watchlist_group_added = 'explorer_address_watchlist_group_added'
}
