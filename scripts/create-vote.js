const BrightIdRegister = artifacts.require("BrightIdRegister.sol")
const ACL = artifacts.require("ACL.sol")
const {encodeCallScript} = require("@aragon/test-helpers/evmScript")

const BRIGHT_ID_REGISTER_ADDRESS = "0x7714eb44754cb9db6d65b61f3352df12600dc593"
const ACL_ADDRESS = "0xbc4fb635636b81e60a4e356c4dceb53cac507d03"
const VERIFIER = "0xb1d71F62bEe34E9Fc349234C201090c33BCdF6DB"
const UPDATE_SETTINGS_ROLE = "0x9d4f140430c9045e12b5a104aa9e641c09b980a26ab8e12a32a2f3d155229ae3"
const CELESTE_GOVERNOR = "0x23e4941f58896705d5c29d641979c4f66b03496f"


const createVoteScript = async () => {
  const brightIdRegister = await BrightIdRegister.at(BRIGHT_ID_REGISTER_ADDRESS)
  const updateVerifier = brightIdRegister.contract.methods.setBrightIdVerifiers([VERIFIER], 1).encodeABI()
  const updateVerifierAction = {
    to: BRIGHT_ID_REGISTER_ADDRESS,
    calldata: updateVerifier
  }

  const acl = await ACL.at(ACL_ADDRESS)
  const grantUpdateSettingsRole = acl.contract.methods.grantPermission(CELESTE_GOVERNOR, BRIGHT_ID_REGISTER_ADDRESS, UPDATE_SETTINGS_ROLE).encodeABI()
  const grantTransferPermissionAction = {
    to: ACL_ADDRESS,
    calldata: grantUpdateSettingsRole
  }

  return encodeCallScript([updateVerifierAction, grantTransferPermissionAction])
}

module.exports = async (callback) => {
  try {
    console.log(`Vote call script: ${await createVoteScript()}`)
  } catch (error) {
    console.log(error)
  }
  callback()
}
