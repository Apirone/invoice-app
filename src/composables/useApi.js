import { getEnv } from '@/utils/env'

export default function() {
  const SERVICE_URL = getEnv('SERVICE_URL')
  const WALLETS_EP = getEnv('WALLETS_EP')
  const INVOICES_EP = getEnv('INVOICES_EP')

  async function getCurrencies() {
    const response = await fetch(`${SERVICE_URL}${WALLETS_EP}`, { method: 'OPTIONS' })
    if (!response.ok) {
      throw "Can't get currencies"
    }
    const json = await response.json()
    return json.currencies
  }

  async function getInvoiceById(id) {
    const response = await fetch(`${SERVICE_URL}${INVOICES_EP.replace('%s', id)}`)
    if (!response.ok) {
      throw "Can't get invoice"
    }
    return await response.json()
  }

  return {
    getCurrencies,
    getInvoiceById,
  }
}
