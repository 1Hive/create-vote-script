const ACL = artifacts.require("ACL.sol")
const {encodeCallScript} = require("@aragon/test-helpers/evmScript")

const AGREEMENT = "0x59a15718992a42082ab2306bc6cbd662958a178c"
const ACL_ADDRESS = "0xbc4fb635636b81e60a4e356c4dceb53cac507d03"
const MANAGE_DISPUTABLE_ROLE = "0x2309a8cbbd5c3f18649f3b7ac47a0e7b99756c2ac146dda1ffc80d3f80827be"
const COLLATERAL_REQUIREMENT_UPDATER = "0xc08fbc829a879470c15916aad14e85905e6ab901"
const VOTING = "0xfbd0b2726070a9d6aff6d7216c9e9340eae68b2a"


const createVoteScript = async () => {
  const acl = await ACL.at(ACL_ADDRESS)

  const createUpdateSettingsRole = acl.contract.methods.createPermission(COLLATERAL_REQUIREMENT_UPDATER, AGREEMENT, MANAGE_DISPUTABLE_ROLE, VOTING).encodeABI()
  const createTransferPermissionAction = {
    to: ACL_ADDRESS,
    calldata: createUpdateSettingsRole
  }

  return encodeCallScript([createTransferPermissionAction])
}

module.exports = async (callback) => {
  try {
    console.log(`Vote call script: ${await createVoteScript()}`)
  } catch (error) {
    console.log(error)
  }
  callback()
}
