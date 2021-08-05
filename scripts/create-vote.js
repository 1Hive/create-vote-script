const Voting = artifacts.require("Voting.sol")
const Agent = artifacts.require("Agent.sol")
const FarmGovernor = artifacts.require("FarmGovernor.sol")
const {encodeCallScript} = require("@aragon/test-helpers/evmScript")

const VOTING_APP_ADDRESS = "0x00f9092e5806628d7a44e496c503cec608e64f1f"
const FARM_GOVERNOR = "0xe41505dc55128fda0bbbb6455bb7e242900ef45b"
const AGENT = "0xdc9260ad6a3a05609e15f57073ed045593309afa"

const BN = (number) => new web3.utils.BN(number)
const withDecimals = (number) => BN(number).mul(BN(10).pow(BN(18)))

const createVoteScript = async () => {

  // const tokensToTransfer = withDecimals(TOKENS_TO_TRANSFER)
  const farmGovernor = FarmGovernor.at(FARM_GOVERNOR)
  const updatePoints = farmGovernor.contract.methods.modifyPools(/** que **/).encodeABI()

  const agent = Agent.at(AGENT)
  const agentExecute = agent.contract.methods.execute(FARM_GOVERNOR, 0, updatePoints)
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
