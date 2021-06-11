const DandelionVoting = artifacts.require("DandelionVoting.sol")
const Voting = artifacts.require("Voting.sol")
const Vault = artifacts.require("Vault.sol")
const TokenManager = artifacts.require("HookedTokenManager.sol")
const ACL = artifacts.require("ACL.sol")
const AragonCourt = artifacts.require("AragonCourt.sol")
const CourtSubscriptions = artifacts.require("CourtSubscriptions.sol")
const {encodeCallScript} = require("@aragon/test-helpers/evmScript")

const CURRENT_ACL_ADDRESS = "0x6d3652655c59fc758942FA0A482a576146cCc2D6"
const VAULT_TRANSFER_ROLE = "0x8502233096d909befbda0999bb8ea2f3a6be3c138b9fbf003752a4c8bce86f6c"
const CURRENT_VOTING_APP_ADDRESS = "0x23e4941f58896705d5c29d641979c4f66b03496f"
const CURRENT_TOKEN_MANAGER_ADDRESS = "0x2118c3343f6d6d7a2b2ff68c82581cc188166d54"
const NEW_TOKEN_MANAGER_ADDRESS = "0xed062e26c8f41a9088d060156edc7fc6c17d5825"
const CURRENT_VAULT_ADDRESS = "0x05e42c4ae51ba28d8acf8c371009ad7138312ca4"
const NEW_VAULT_ADDRESS = "0x4ba7362f9189572cbb1216819a45aba0d0b2d1cb"
const HONEY_ADDRESS = "0x71850b7e9ee3f13ab46d67167341e4bdc905eef9"
const COURT_ADDRESS = "0x44E4fCFed14E1285c9e0F6eae77D5fDd0F196f85"
const CURRENT_COURT_SUBSCRIPTIONS = "0x41aB49872ED459C840d0CAecd47FcDC201C48307"
const NEW_COURT_SUBSCRIPTIONS = "0x4e4EA6845d7656d569DC4CCC7b68Bb3023720837"

  // 20840000000000000

const BN = (number) => new web3.utils.BN(number)
const withDecimals = (number) => BN(number).mul(BN(10).pow(BN(18)))

const createVoteScript = async () => {

  const courtSubscriptions = await CourtSubscriptions.at(CURRENT_COURT_SUBSCRIPTIONS)
  const transferFunds = courtSubscriptions.contract.methods.recoverFunds(HONEY_ADDRESS, NEW_COURT_SUBSCRIPTIONS).encodeABI()
  const transferFundsAction = {
    to: CURRENT_COURT_SUBSCRIPTIONS,
    calldata: transferFunds
  }

  const aragonCourt = await AragonCourt.at(COURT_ADDRESS)
  const updateModule = aragonCourt.contract.methods
    .setModule("0x2bfa3327fe52344390da94c32a346eeb1b65a8b583e4335a419b9471e88c1365", NEW_COURT_SUBSCRIPTIONS).encodeABI()
  const updateModuleAction = {
    to: COURT_ADDRESS,
    calldata: updateModule
  }

  const actionCallScript = encodeCallScript([transferFundsAction, updateModuleAction])

  const voting = await Voting.at(CURRENT_VOTING_APP_ADDRESS)
  const voteAction = {
    to: CURRENT_VOTING_APP_ADDRESS,
    calldata: voting.contract.methods.newVote(actionCallScript, "0x").encodeABI()
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
