//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minimum, string calldata description)
        public
    {
        address campaign = address(
            new Campaign(minimum, msg.sender, description)
        );
        deployedCampaigns.push(campaign);
    }

    function fetchAllCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    address public manager;
    uint256 public minimunContribution;
    mapping(address => bool) public approvers;
    string public campaignDescription;

    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalsCount;
        mapping(address => bool) approvals;
    }
    Request[] public requests;
    uint256 approversCount = 0;

    modifier onlyManagerCreateRequest() {
        require(msg.sender == manager);
        _;
    }

    constructor(
        uint256 minimum,
        address creator,
        string memory desciption
    ) {
        manager = creator;
        minimunContribution = minimum;
        campaignDescription = desciption;
    }

    function contribute() public payable {
        require(msg.value > minimunContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string calldata description,
        uint256 value,
        address recipient
    ) public onlyManagerCreateRequest {
        Request storage request = requests.push();
        request.description = description;
        request.value = value;
        request.recipient = recipient;
        request.complete = false;
        request.approvalsCount = 0;
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalsCount++;
    }

    function finalizeRequest(uint256 index) public onlyManagerCreateRequest {
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalsCount > (approversCount / 2));

        request.complete = true;
        payable(request.recipient).transfer(request.value);
    }

    function getCampaingDetails()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address,
            string memory
        )
    {
        return (
            minimunContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager,
            campaignDescription
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }

    function getApproversCount() public view returns (uint256) {
        return approversCount;
    }
}
