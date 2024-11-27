// SPDX-License-Identifier: MIT 

pragma solidity ^0.8.0;

interface IERC20{
  function transfer(address recipient, uint256 amount) external returns(bool);
  function balanceOf(address account) external view returns(uint256);
  function symbol() external view returns(string memory);
  function totalSupply() external view returns(uint256);
  function name() external view returns(string memory);
}

contract ICOMarketplace {

  struct TokenDetails{
    address token;
    bool supported;
    uint256 price;
    address creator;
    string name;
    string symbol;
  }

  //MAPPING
  mapping(address => TokenDetails) public tokenDetails;
  address [] public allSupportedTokens;
  address public owner;

  //EVENTS
  event TokenRecieved(address indexed token, address indexed from, uint256 amount);
  event TokenTransferred(address indexed token, address indexed to, uint256 amount);
  event TokenWithdraw(address indexed token, address indexed to, uint256 amount);
  event TokenAdded(address indexed token, uint256 price, address indexed creator,
    string name, string symbol);


  // MODIFIERS

  modifier supportedToken(address _token) {
    
  }

  modifier onlyOwner() {

  }

  modifier onlyCreator(address _token) {

  }

  receive() external payable {

  }

  constructor() {

  }

  //CONTRACT FUNCTIONS

  function createICOSale(address _token, uint256 _price) {

  }

  function multiply(uint256 x, uint256 y) internal pure returns(uint256 z) {

  } 

  function buyToken(address _token, uint256 _amount) external payable supportedToken(_token) {}

  function getBalance(address _token) external view returns(uint256){}

  function getSupportedTokens() external view returns(address[] memory) {

  }

  function withdraw(address _token, uint256 _amount) external onlyCreator(_token) supportedToken(_token){

  }

  function getTokenDetails(address) external view returns(TokenDetails memory) {

  }

  function getTokenCreatedBy(address _creator) external view returns(TokenDetails[] memory) {}

  function getAllTokens() external view returns(TokenDetails[] memory) {}
 }