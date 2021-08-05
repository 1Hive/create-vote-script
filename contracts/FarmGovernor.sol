pragma solidity ^0.4.24;

contract FarmGovernor {

    function modifyPools(address[]  _lpTokens, uint256[]  _allocations, bool[] _isAdding) external;
}
