import { http, createConfig } from '@wagmi/core'
import { mainnet, sepolia } from '@wagmi/core/chains'

declare module '@wagmi/vue' {
  interface Register {
    config: typeof config
  }
}
export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/kCegRD2Bjk2UpY9iK-sK5M7gFgeu3Kx1'),
  },
})