import apiList from '@/static/APIDescription.json'

export interface ApiMeta {
  key: string
  title: string
  description: string
  requiresSecureContext?: boolean
}

export function getApiMeta(key: string): ApiMeta {
  const meta = apiList.find((item) => item.key === key)
  if (!meta) {
    throw new Error(`API meta not found: ${key}`)
  }
  return meta
}
