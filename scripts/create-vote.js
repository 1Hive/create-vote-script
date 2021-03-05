const DandelionVoting = artifacts.require("DandelionVoting.sol")
const Vault = artifacts.require("Vault.sol")
const TokenManager = artifacts.require("HookedTokenManager.sol")
const {encodeCallScript} = require("@aragon/test-helpers/evmScript")

const CURRENT_VOTING_APP_ADDRESS = "0x00f9092e5806628d7a44e496c503cec608e64f1f"
const CURRENT_TOKEN_MANAGER_ADDRESS = "0x2118c3343f6d6d7a2b2ff68c82581cc188166d54"
const NEW_TOKEN_MANAGER_ADDRESS = "0xb244a2bba0434a1580b374d2577e2c858486675b"
const CURRENT_VAULT_ADDRESS = "0x05e42c4ae51ba28d8acf8c371009ad7138312ca4"
const NEW_VAULT_ADDRESS = "0x22018da06e66bb468c9786bea1d6617cb05c79b9"
const HONEY_ADDRESS = "0x71850b7e9ee3f13ab46d67167341e4bdc905eef9"
const TOKENS_TO_TRANSFER = 25000

const BN = (number) => new web3.utils.BN(number)
const withDecimals = (number) => BN(number).mul(BN(10).pow(BN(18)))

const createVoteScript = async () => {
  const tokenManager = await TokenManager.at(CURRENT_TOKEN_MANAGER_ADDRESS)
  const updateController = tokenManager.contract.methods.changeTokenController(NEW_TOKEN_MANAGER_ADDRESS).encodeABI()
  const updateControllerAction = {
    to: CURRENT_TOKEN_MANAGER_ADDRESS,
    calldata: updateController
  }

  const tokensToTransfer = withDecimals(TOKENS_TO_TRANSFER)
  const vault = await Vault.at(CURRENT_VAULT_ADDRESS)
  const transferFunds = vault.contract.methods.transfer(HONEY_ADDRESS, NEW_VAULT_ADDRESS, tokensToTransfer).encodeABI()
  const transferFundsAction = {
    to: CURRENT_VAULT_ADDRESS,
    calldata: transferFunds
  }

  const actionCallScript = encodeCallScript([updateControllerAction, transferFundsAction])

  const voting = await DandelionVoting.at(CURRENT_VOTING_APP_ADDRESS)
  const voteAction = {
    to: CURRENT_VOTING_APP_ADDRESS,
    calldata: voting.contract.methods.newVote(actionCallScript, "0x", false).encodeABI()
  }
  return encodeCallScript([voteAction])
}

module.exports = async (callback) => {
  try {
    console.log(`Vote call script: ${await createVoteScript()}`)
  } catch (error) {
    console.log(error)
  }
  callback()
}
