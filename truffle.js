/**
 * https://github.com/aragon/aragonOS/blob/v4.0.0/truffle-config.js
 */

const homedir = require('homedir')
const path = require('path')

const HDWalletProvider = require('truffle-hdwallet-provider')
const HDWalletProviderPrivkey = require('truffle-hdwallet-provider-privkey')

const DEFAULT_MNEMONIC =
  'explain tackle mirror kit van hammer degree position ginger unfair soup bonus'

const defaultRPC = network => `https://${network}.eth.aragon.network`

const configFilePath = filename => path.join(homedir(), `.aragon/${filename}`)

const mnemonic = () => {
  try {
    return require(configFilePath('mnemonic.json')).mnemonic
  } catch (e) {
    return DEFAULT_MNEMONIC
  }
}

const settingsForNetwork = network => {
  try {
    return require(configFilePath(`${network}_key.json`))
  } catch (e) {
    return {}
  }
}

// Lazily loaded provider
const providerForNetwork = network => () => {
  let { rpc, keys } = settingsForNetwork(network)
  rpc = rpc || defaultRPC(network)

  if (!keys || keys.length === 0) {
    return new HDWalletProvider(mnemonic(), rpc)
  }

  return new HDWalletProviderPrivkey(keys, rpc)
}
module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
    },
    rinkeby: {
      network_id: 4,
      provider: providerForNetwork('rinkeby'),
    },
    xdai: {
      network_id: 100,
      provider: providerForNetwork('xdai'),
      gas: 95e5,
      gasPrice: 1000000000,
    }
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: '0.4.24', // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 10000,
        },
      },
    },
  },
}
