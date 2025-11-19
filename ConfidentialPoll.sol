// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@fhenixprotocol/contracts/FHE.sol";
import "@fhenixprotocol/contracts/access/Permissioned.sol";

contract ConfidentialPoll is Permissioned {
    euint32 private yesVotes;
    euint32 private noVotes;

    constructor() Permissioned(msg.sender) {}

    function vote(bytes calldata encryptedChoice) external {
        euint32 choice = FHE.asEuint32(encryptedChoice);
        yesVotes = FHE.add(yesVotes, FHE.eq(choice, FHE.asEuint32(1)));
        noVotes  = FHE.add(noVotes,  FHE.eq(choice, FHE.asEuint32(0)));
    }

    function getResults(bytes calldata publicKey) external view returns (bytes memory, bytes memory) {
        return (
            FHE.decrypt(yesVotes, publicKey),
            FHE.decrypt(noVotes, publicKey)
        );
    }
}
