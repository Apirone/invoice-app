export function getEnv(name) {
  if (!name || typeof name !== 'string') {
    return
  }
  // Runtime config (from window.invoice_app_config) has priority over build-time config
  return window?.invoice_app_config?.[name.toLowerCase()]
    ?? import.meta.env['VITE_' + name.toUpperCase()]
}

const PUBLIC_PATH = getEnv('PUBLIC_PATH')
export const publicPath = !PUBLIC_PATH || PUBLIC_PATH === './' ? '' : PUBLIC_PATH
