pragma solidity ^0.4.0;

contract Voting {

    function newVote(bytes _executionScript, string _metadata) external returns (uint256 voteId);

}
