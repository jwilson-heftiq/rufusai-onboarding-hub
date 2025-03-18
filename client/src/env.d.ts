/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH0_DOMAIN: string
  readonly VITE_AUTH0_CLIENT_ID: string
  readonly VITE_AWS_OAUTH_TOKEN_URL: string
  readonly VITE_AWS_OAUTH_CLIENT_ID: string
  readonly VITE_AWS_OAUTH_CLIENT_SECRET: string
  readonly VITE_AWS_API_GATEWAY_URL: string
  readonly VITE_PROPELAUTH_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}