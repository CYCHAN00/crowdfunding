// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract CrowdfundingFactory {
    address[] public deployedCrowdfunding;

    function createCrowdfunding(
        string calldata title,
        string calldata description,
        string calldata imageUrl,
        uint minimum,
        uint goalAmount,
        uint durationInDays
    ) public {
        address newCrowdfunding = address(
            new Crowdfunding(
                title,
                description,
                imageUrl,
                minimum,
                goalAmount,
                durationInDays,
                msg.sender
            )
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
    string public title;
    string public description;
    string public imageUrl;
    uint public minimumContribution;
    uint public goalAmount;
    uint public deadline;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(
        string memory _title,
        string memory _description,
        string memory _imageUrl,
        uint minimum,
        uint _goalAmount,
        uint durationInDays,
        address _address
    ) {
        manager = _address;
        title = _title;
        description = _description;
        imageUrl = _imageUrl;
        minimumContribution = minimum;
        goalAmount = _goalAmount;
        deadline = block.timestamp + (durationInDays * 1 days);
    }

    function contribute() public payable {
        require(block.timestamp < deadline, "Campaign has ended");
        require(msg.value > minimumContribution, "Below minimum contribution");
        approvers[msg.sender] = true;
        approversCount++;
    }

    function getSummary()
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint,
            uint,
            uint,
            uint,
            uint,
            address
        )
    {
        return (
            title,
            description,
            imageUrl,
            minimumContribution,
            goalAmount,
            deadline,
            address(this).balance,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

    function createRequest(
        string calldata _description,
        uint value,
        address payable recipient
    ) public restricted {
        Request storage newRequest = requests.push();

        newRequest.description = _description;
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
