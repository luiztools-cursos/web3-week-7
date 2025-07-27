// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

contract LinkShield {

    struct Link {
        string url;
        address owner;
        uint256 fee;
    }

    uint256 public commission = 1;
    mapping(string => Link) private links; 
    mapping(string => mapping(address => bool)) public hasAccess;

    function addLink(string calldata url, string calldata linkId, uint256 fee) public {
        Link memory link = links[linkId];
        require(link.owner == address(0) || link.owner == msg.sender, "This linkId already has an owner");
        require(fee == 0 || fee > commission, "Fee too low");

        link.url = url;
        link.fee = fee;
        link.owner = msg.sender;

        links[linkId] = link;
        hasAccess[linkId][msg.sender] = true;
    }

    function payLink(string calldata linkId) public payable {
        Link memory link = links[linkId];
        require(link.owner != address(0), "Link not found");
        require(hasAccess[linkId][msg.sender] == false, "You already have access"); 
        require(msg.value >= link.fee, "Insufficient payment");

        hasAccess[linkId][msg.sender] = true;
        payable(link.owner).transfer(msg.value - commission); 
    }

    function getLink(string calldata linkId) public view returns (Link memory){
        Link memory link = links[linkId];
        if(link.fee == 0) return link;
        if(hasAccess[linkId][msg.sender] == false)
            link.url = "";

        return link;
    }
}