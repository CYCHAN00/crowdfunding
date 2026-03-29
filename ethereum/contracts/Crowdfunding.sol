// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract CrowdfundingFactory {
    address[] public deployedCrowdfunding;

    function createCrowdfunding(uint minimum) public {
        address newCrowdfunding = address(
            new Crowdfunding(minimum, msg.sender)
        );
        deployedCrowdfunding.push(newCrowdfunding);
    }

    function getDeployedCrowdfunding() public view returns (address[] memory) {
        return deployedCrowdfunding;
    }
}

contract Crowdfunding {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum, address _address) {
        manager = _address;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string calldata description,
        uint value,
        address payable recipient
    ) public restricted {
        Request storage newRequest = requests.push();

        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.complete = true;

        (bool success, ) = request.recipient.call{value: request.value}("");
        require(success, "Transfer failed");
    }
}
