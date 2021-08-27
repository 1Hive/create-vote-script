const Voting = artifacts.require("Misc.sol")
const Agent = artifacts.require("Misc.sol")
const FarmGovernor = artifacts.require("FarmGovernor.sol")
const {encodeCallScript} = require("@aragon/test-helpers/evmScript")

const VOTING_APP_ADDRESS = "0xf1e8db24873c568cc964e6b6f95ed14d5d74021b"
const FARM_GOVERNOR = "0xe41505dc55128fda0bbbb6455bb7e242900ef45b"
const AGENT = "0xdc9260ad6a3a05609e15f57073ed045593309afa"

const BN = (number) => new web3.utils.BN(number)
const withDecimals = (number) => BN(number).mul(BN(10).pow(BN(18)))

const createVoteScript = async () => {

  const farmGovernor = await FarmGovernor.at(FARM_GOVERNOR)
  const updatePoints = farmGovernor.contract.methods.modifyPools(
    ["0xBf4E56921B55314aDA601212B088e7489Cca5893", "0x7227894f45dee341f3de303172629073bf9e30c4"],
    [412, 13],
    [false, true])
    .encodeABI()

  const agent = await Agent.at(AGENT)
  const agentExecute = agent.contract.methods.execute(FARM_GOVERNOR, 0, updatePoints).encodeABI()
  const agentExecuteAction = {
    to: AGENT,
    calldata: agentExecute
  }

  const actionCallScript = encodeCallScript([agentExecuteAction])

  const voting = await Voting.at(VOTING_APP_ADDRESS)
  const voteAction = {
    to: VOTING_APP_ADDRESS,
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
