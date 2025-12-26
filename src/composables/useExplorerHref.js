/**
 * @param {string} currency 
 * @param {string} type 
 * @param {string} value 
 * @param {string} abbr 
 * @returns 
 */
function getExplorerHref(currency, type, value, abbr = '') {
  let explorer = 'blockchair.com'
  let currencyValue = currency

  if (!currency) {
      return
  }
  if (currency) {
    currency = currency.toLowerCase()
  }
  if (abbr) {
    abbr = abbr.toLowerCase()
  }

  const isTron = currency.includes('tron') || currency.includes('trc20')
  const isTronTestnet = currency.includes('testnet') || abbr.includes('ttrx')
  if (isTron) {
    explorer = isTronTestnet ? 'shasta.tronscan.org' : 'tronscan.org'
    currencyValue = '#'
  }

  const isEth = abbr.includes('eth')
  const isTestEth = abbr.includes('teth')
  if (isEth) {
    explorer = isTestEth ? 'sepolia.etherscan.io' : 'etherscan.io'
    currencyValue = ''
  }

  const isBnb = abbr.includes('bnb')
  const isTestBnb = abbr.includes('tbnb')
  if (isBnb) {
    explorer = isTestBnb ? 'testnet.bscscan.com' : 'bscscan.com'
    currencyValue = ''
  }

  const isBtc = abbr === 'btc'
  if (isBtc) {
    explorer = 'explorer.apirone.com'
    currencyValue = ''
  } else {
    const isTestBtc = abbr.includes('tbtc')
    if (isTestBtc) {
      currencyValue = 'bitcoin/testnet'
    }
  }

  if (type === 'transaction' && (isEth || isBtc || isBnb)) {
    type = 'tx'
  }

  const pathParts = [currencyValue, type, value].filter(Boolean).join('/')
  return `https://${explorer}/${pathParts}?from=apirone`
}

export default function() {
  return {
    getExplorerHref,
  }
}