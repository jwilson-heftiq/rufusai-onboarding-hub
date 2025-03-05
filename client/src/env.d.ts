/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH0_DOMAIN: string
  readonly VITE_AUTH0_CLIENT_ID: string
  readonly AWS_API_GATEWAY_URL: string
  readonly AWS_OAUTH_CLIENT_ID: string
  readonly AWS_OAUTH_CLIENT_SECRET: string
  readonly AWS_OAUTH_TOKEN_URL: string
  readonly AWS_OAUTH_AUTH_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
