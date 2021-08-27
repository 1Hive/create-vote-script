pragma solidity ^0.4.24;

contract Misc {

    function newVote(bytes _executionScript, string _metadata) external returns (uint256 voteId);

    function execute(address _target, uint256 _ethValue, bytes _data) external;
}
