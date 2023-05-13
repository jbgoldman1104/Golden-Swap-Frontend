// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

// import "./DividendPayingToken.sol";

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./LemonSwapDividendTracker.sol";
// import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
// import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
// // import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol";
// import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
// import { IterableMapping } from "./Libraries.sol";

contract LemonSwap is ERC20, Ownable {
    using SafeMath for uint256;

    string internal constant TOKEN_NAME = "Lemon Swap";
    string internal constant TOKEN_SYMBOL = "Lemon";

    uint256 internal constant TOTAL_SUPPLY = 10 ** 12 * 10 ** 18;


    uint256 public constant VERSION = 1;

    IUniswapV2Router02 public uniswapV2Router;
    address public uniswapV2Pair;

    bool private swapping;

    LemonSwapDividendTracker public dividendTracker;

    address public rewardToken; // Default RewardToken must be BNB

    uint256 public swapTokensAtAmount; //Trigger value to start Swap
    uint256 public swapTokensAtAmountMax = 5 * (10 ** 6) * (10 ** 18);
     mapping(address => bool) private _isExcludedFromMaxWallet;
    // Fees for sell / buy
    uint256[] public marketingFeeList = [2, 1] ;
    uint256[] public devFeeList = [1, 1];
    uint256[] public liquidityFeeList = [2, 1];
    uint256[] public tokenRewardsFeeList = [7, 7]; //Tax for Contract Owner, Reflection

    bool public swapAndLiquifyEnabled = true;

    // Calculated Fee
    uint256 private countMarketingFees = 0;
    uint256 private countDevFees = 0;
    uint256 private countLiquidityFees = 0;
    uint256 private countRewardsFees = 0;
        
    

    uint256 public _botIncreaseFee = 3; //Anti-bot

    // Addresses
    address public _ownerAddress = 0x6755392378309858962bb5374C9Bf9A90Ecc1dC2;
    
    address public deadAddress = 0x000000000000000000000000000000000000dEaD;
    address public _marketingWalletAddress = 0x4DE20E96cE7690f72517C3ae299CB371f1e06B8b;
    address public _devWalletAddress = 0xCeBbc397b444015C90C14359B4E4183DFF6ac83A;


    uint256 public gasForProcessing;

    // exlcude from fees and max transaction amount
    mapping(address => bool) private _isExcludedFromFees;

    // store addresses that a automatic market maker pairs. Any transfer *to* these addresses
    // could be subject to a maximum transfer amount
    mapping(address => bool) public automatedMarketMakerPairs;

    // Anti-whale Feature
    bool private enableAntiWhale = false;
    mapping(address => bool) private _isExcludedFromAntiWhale;
    uint256 public maxTransferAmountRate = 500;

    // Anti-Bot
    bool public launchAddLiquidity = false;
    uint256 public launchTime = 0;
    uint256 public timeDetectBotSeconds = 2;
    uint256 public timeAntiBot = 60 * timeDetectBotSeconds; 
    bool public antibotSystemEnable = true;
    uint256 public maxWalletRate = 300;
    uint256 public _maxWalletSize = TOTAL_SUPPLY.mul(maxWalletRate).div(10000);

    mapping(address => bool) _isBot;

    modifier antiWhale(address sender, address recipient, uint256 amount) {
        if (enableAntiWhale && maxTransferAmount() > 0 && !automatedMarketMakerPairs[sender]) {
            if (
                _isExcludedFromAntiWhale[sender] == false
                && _isExcludedFromAntiWhale[recipient] == false
            ) {
                require(amount <= maxTransferAmount(), "AntiWhale: Transfer amount exceeds the maxTransferAmount");
            }
        }
        _;
    }

    event UpdateDividendTracker(
        address indexed newAddress,
        address indexed oldAddress
    );

    event UpdateUniswapV2Router(
        address indexed newAddress,
        address indexed oldAddress
    );

    event ExcludeFromFees(address indexed account, bool isExcluded);
    event ExcludeMultipleAccountsFromFees(address[] accounts, bool isExcluded);

    event SetAutomatedMarketMakerPair(address indexed pair, bool indexed value);

    event LiquidityWalletUpdated(
        address indexed newLiquidityWallet,
        address indexed oldLiquidityWallet
    );

    event GasForProcessingUpdated(
        uint256 indexed newValue,
        uint256 indexed oldValue
    );

    event SwapAndLiquify(
        uint256 tokensSwapped,
        uint256 ethReceived,
        uint256 tokensIntoLiqudity,
        bool success
    );

    // event SendDividends(uint256 tokensSwapped, uint256 amount);
    event SendDividends(
        uint256 dividends,
        uint256 marketing,
        uint256 dev,
        bool success
    );

    event ProcessedDividendTracker(
        uint256 iterations,
        uint256 claims,
        uint256 lastProcessedIndex,
        bool indexed automatic,
        uint256 gas,
        address indexed processor
    );

    event UpdatePayoutToken(address account, address token);
    event UpdateAllowTokens(address token, bool allow);

    event EnableSwapAndLiquify(bool enabled);

    constructor() ERC20(TOKEN_NAME, TOKEN_SYMBOL) {
        rewardToken = address(0);  //Original Reward Token will be BNB on BSCNEt

        swapTokensAtAmount = TOTAL_SUPPLY.mul(2).div(10**6); // 0.002%

        // use by default 300,000 gas to process auto-claiming dividends
        gasForProcessing = 300000;

        // RouterAddress
        // 0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3 // BSC TestNet (John)
        // 0x10ED43C718714eb63d5aA57B78B54704E256024E // BSC Mainnet
        // 0x1Ed675D5e63314B760162A3D1Cae1803DCFC87C7 // BSC TestNet (ME)
        // 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff // Polygon Mainnet 
        address _routerAddress = 0x10ED43C718714eb63d5aA57B78B54704E256024E;

        dividendTracker = new LemonSwapDividendTracker(_routerAddress);

        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(_routerAddress);
        
        // Create a uniswap pair for this new token
        address _uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory())
            .createPair(address(this), _uniswapV2Router.WETH());
        uniswapV2Router = _uniswapV2Router;
        uniswapV2Pair = _uniswapV2Pair;
        _setAutomatedMarketMakerPair(_uniswapV2Pair, true);

        // exclude from receiving dividends
        dividendTracker.excludeFromDividends(address(dividendTracker));
        dividendTracker.excludeFromDividends(address(this));
        dividendTracker.excludeFromDividends(address(0xdead));
        dividendTracker.excludeFromDividends(address(_uniswapV2Router));

        // exclude from paying fees or having max transaction amount
       
        // excludeFromFees(owner(), true); //Owner = Liquidity
        excludeFromFees(_marketingWalletAddress, true);
        excludeFromFees(_devWalletAddress, true);
        excludeFromFees(deadAddress,true);
        excludeFromFees(_ownerAddress,true);
        excludeFromFees(address(this), true);
        _isExcludedFromMaxWallet[_ownerAddress] = true;
        _isExcludedFromMaxWallet[address(0)] = true;
        _isExcludedFromMaxWallet[address(this)] = true;
        _isExcludedFromMaxWallet[deadAddress] = true;
        /*
            _mint is an internal function in ERC20.sol that is only called here,
            and CANNOT be called ever again
        */
        //Anti-Whale
        _isExcludedFromAntiWhale[_ownerAddress]                 = true;
        _isExcludedFromAntiWhale[address(0)]              = true;
        _isExcludedFromAntiWhale[address(this)]           = true;


        // Add Allow Payouttokens Tokens
        //MainNet
        //WBTC
        updateAllowTokens(0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c, true); 
        //SHIB
        updateAllowTokens(0x2859e4544C4bB03966803b044A93563Bd2D0DD4D, true); 
        //BUSD
        updateAllowTokens(0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56, true);
        //CAKE
        updateAllowTokens(0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82, true);

        //TestNet
        //WBTC
        updateAllowTokens(0x538CbE842C0d88e196cd96f0169Bf73DD7cC39e4, true);
        //SHIB
        updateAllowTokens(0xaF708DEB3dBB10932D3D88d09999b3A68500F036, true);
        //BUSD
        updateAllowTokens(0xCeC0B363B3Ac190C0e5cdFDb448521476F60B162, true);
        //Cake
        updateAllowTokens(0x8A4F60C240Fa0b1380a7569c4e4D0600f71212c3, true);

        // Polygon Mainnet
        // USDT
        updateAllowTokens(0xc2132D05D31c914a87C6611C10748AEb04B58e8F, true);
        
        

        _mint(_ownerAddress, TOTAL_SUPPLY);

    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function setMaxWalletRate(uint256 _val) public onlyOwner {
       require(_val > 0 && _val <= 500, "max 5%");
       _maxWalletSize = TOTAL_SUPPLY.mul(_val).div(10000);
   }

    receive() external payable {}

    function setSwapTokensAtAmount(uint256 amount) external onlyOwner {
        swapTokensAtAmount = amount;
    }

    function updateDividendTracker(address newAddress) public onlyOwner {
        require(
            newAddress != address(dividendTracker),
            "LemonSwap: The dividend tracker already has that address"
        );

        LemonSwapDividendTracker newDividendTracker = LemonSwapDividendTracker(
            payable(newAddress)
        );

        require(
            newDividendTracker.owner() == address(this),
            "LemonSwap: The new dividend tracker must be owned by the LemonSwap token contract"
        );

        newDividendTracker.excludeFromDividends(address(newDividendTracker));
        newDividendTracker.excludeFromDividends(address(this));
        newDividendTracker.excludeFromDividends(owner());
        newDividendTracker.excludeFromDividends(address(uniswapV2Router));

        emit UpdateDividendTracker(newAddress, address(dividendTracker));

        dividendTracker = newDividendTracker;
    }

    function updateUniswapV2Router(address newAddress) public onlyOwner {
        require(
            newAddress != address(uniswapV2Router),
            "LemonSwap: The router already has that address"
        );
        emit UpdateUniswapV2Router(newAddress, address(uniswapV2Router));
        uniswapV2Router = IUniswapV2Router02(newAddress);
        address _uniswapV2Pair = IUniswapV2Factory(uniswapV2Router.factory())
            .createPair(address(this), uniswapV2Router.WETH());
        uniswapV2Pair = _uniswapV2Pair;

        dividendTracker.updateUniswapV2Router(newAddress);
    }

    function excludeFromFees(address account, bool excluded) public onlyOwner {
        require(
            _isExcludedFromFees[account] != excluded,
            "LemonSwap: Account is already the value of 'excluded'"
        );
        _isExcludedFromFees[account] = excluded;

        emit ExcludeFromFees(account, excluded);
    }

    function excludeMultipleAccountsFromFees(
        address[] calldata accounts,
        bool excluded
    ) public onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            _isExcludedFromFees[accounts[i]] = excluded;
        }

        emit ExcludeMultipleAccountsFromFees(accounts, excluded);
    }

    function updateMarketingWallet(address payable wallet) external onlyOwner {
        _marketingWalletAddress = wallet;
    }

    function updateDevWallet(address payable _wallet) external onlyOwner {
        _devWalletAddress = _wallet;
    }

    function isFeeAcceptable(bool isSelling) internal view returns (bool) {
        uint256 _index = isSelling ? 0 : 1;
        return (marketingFeeList[_index] + 
            devFeeList[_index] + 
            liquidityFeeList[_index] + 
            tokenRewardsFeeList[_index]) < 25;
    }

    function setMarketingSellFee(uint256 value) external onlyOwner {
        marketingFeeList[0] = value;
        require (isFeeAcceptable(true), "Fee not acceptable");
    }

    function setMarketingBuyFee(uint256 value) external onlyOwner {
        marketingFeeList[1] = value;
        require (isFeeAcceptable(false), "Fee not acceptable");
    }

    function setDevSellFee(uint256 value) external onlyOwner{
        devFeeList[0] = value;
        require (isFeeAcceptable(true), "Fee not acceptable");
    }

    function setDevBuyFee(uint256 value) external onlyOwner{
        devFeeList[1] = value;
        require (isFeeAcceptable(false), "Fee not acceptable");
    }

    function setLiquiditySellFee(uint256 value) external onlyOwner {
        liquidityFeeList[0] = value;
        require (isFeeAcceptable(true), "Fee not acceptable");
    }

    function setLiquidityBuyFee(uint256 value) external onlyOwner {
        liquidityFeeList[1] = value;
        require (isFeeAcceptable(false), "Fee not acceptable");
    }

    function setReflectionSellFee(uint256 value) external onlyOwner {
        tokenRewardsFeeList[0] = value;
        require (isFeeAcceptable(true), "Fee not acceptable");
    }

    function setReflectionBuyFee(uint256 value) external onlyOwner {
        tokenRewardsFeeList[1] = value;
        require (isFeeAcceptable(false), "Fee not acceptable");
    }

    function setAutomatedMarketMakerPair(address pair, bool value)
        public
        onlyOwner
    {
        require(
            pair != uniswapV2Pair,
            "LemonSwap: The PancakeSwap pair cannot be removed from automatedMarketMakerPairs"
        );

        _setAutomatedMarketMakerPair(pair, value);
    }

    

    function _setAutomatedMarketMakerPair(address pair, bool value) private {
        require(
            automatedMarketMakerPairs[pair] != value,
            "LemonSwap: Automated market maker pair is already set to that value"
        );
        automatedMarketMakerPairs[pair] = value;

        if (value) {
            dividendTracker.excludeFromDividends(pair);
        }

        emit SetAutomatedMarketMakerPair(pair, value);
    }

    function updateGasForProcessing(uint256 newValue) public onlyOwner {
        require(
            newValue >= 200000 && newValue <= 500000,
            "LemonSwap: gasForProcessing must be between 200,000 and 500,000"
        );
        require(
            newValue != gasForProcessing,
            "LemonSwap: Cannot update gasForProcessing to same value"
        );
        emit GasForProcessingUpdated(newValue, gasForProcessing);
        gasForProcessing = newValue;
    }

    function updateClaimWait(uint256 claimWait) external onlyOwner {
        dividendTracker.updateClaimWait(claimWait);
    }

    function getClaimWait() external view returns (uint256) {
        return dividendTracker.claimWait();
    }

    function updateMinimumTokenBalanceForDividends(uint256 amount)
        external
        onlyOwner
    {
        dividendTracker.updateMinimumTokenBalanceForDividends(amount);
    }

    function getMinimumTokenBalanceForDividends()
        external
        view
        returns (uint256)
    {
        return dividendTracker.minimumTokenBalanceForDividends();
    }

    function getTotalDividendsDistributed() external view returns (uint256) {
        return dividendTracker.totalDividendsDistributed();
    }

    function isExcludedFromFees(address account) public view returns (bool) {
        return _isExcludedFromFees[account];
    }

    function withdrawableDividendOf(address account)
        public
        view
        returns (uint256)
    {
        return dividendTracker.withdrawableDividendOf(account);
    }

    function dividendTokenBalanceOf(address account)
        public
        view
        returns (uint256)
    {
        return dividendTracker.balanceOf(account);
    }

    function excludeFromDividends(address account) external onlyOwner {
        dividendTracker.excludeFromDividends(account);
    }

    function isExcludedFromDividends(address account)
        public
        view
        returns (bool)
    {
        return dividendTracker.isExcludedFromDividends(account);
    }

    function getAccountDividendsInfo(address account)
        external
        view
        returns (
            address,
            int256,
            int256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        return dividendTracker.getAccount(account);
    }

    function getAccountDividendsInfoAtIndex(uint256 index)
        external
        view
        returns (
            address,
            int256,
            int256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        return dividendTracker.getAccountAtIndex(index);
    }

    function processDividendTracker(uint256 gas) external {
        (
            uint256 iterations,
            uint256 claims,
            uint256 lastProcessedIndex
        ) = dividendTracker.process(gas);
        emit ProcessedDividendTracker(
            iterations,
            claims,
            lastProcessedIndex,
            false,
            gas,
            tx.origin
        );
    }

    function claim() external {
        dividendTracker.processAccount(payable(msg.sender), false);
    }

    function claimFor(address payoutToken) external {
        require(balanceOf(msg.sender) > 0, "You must own more than zero $LemonSwap tokens");
        require(payoutToken != address(this));
        
        dividendTracker.updatePayoutToken(msg.sender, payoutToken);
        dividendTracker.processAccount(payable(msg.sender), false);
        dividendTracker.updatePayoutToken(msg.sender, address(0));
    }

    function getLastProcessedIndex() external view returns (uint256) {
        return dividendTracker.getLastProcessedIndex();
    }

    function getNumberOfDividendTokenHolders() external view returns (uint256) {
        return dividendTracker.getNumberOfTokenHolders();
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override antiWhale(from, to, amount) {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        if (amount == 0) {
            super._transfer(from, to, 0);
            return;
        }

        if (to == uniswapV2Pair) {
            if (!launchAddLiquidity && launchTime == 0) {
                launchAddLiquidity = true;
                launchTime = block.timestamp;
            }
        }

        if (launchTime > 0) {
            if(block.timestamp - launchTime <= timeAntiBot && from == uniswapV2Pair) {
                _isBot[to] = true;
            }
        }

        if ((!_isExcludedFromMaxWallet[from] && !_isExcludedFromMaxWallet[to]) && to != uniswapV2Pair) {
            uint balanceNow = balanceOf(to);
            require(balanceNow.add(amount) <= _maxWalletSize,"Max tokens size reached !");
        }

        bool canSwap = balanceOf(address(this)) >= swapTokensAtAmount;

        if (
            canSwap &&
            !swapping &&
            !automatedMarketMakerPairs[from] &&
            from != owner() &&
            to != owner()
        ) {
            swapping = true;

            if (swapAndLiquifyEnabled) {
                swapAndLiquify(countLiquidityFees);
            }

            swapAndSendDividendsMarketingDev(
                countRewardsFees, 
                countMarketingFees,
                countDevFees);

            swapping = false;
        }

        bool takeFee = !swapping;

        // if any account belongs to _isExcludedFromFee account then remove the fee
        if (_isExcludedFromFees[from] || _isExcludedFromFees[to]) {
            takeFee = false;
        }

        if (takeFee) {

            uint256 feeIndex = automatedMarketMakerPairs[to] ? 0 : 1; //Check is Selling

            uint256 _botFeeMultiply = 1;
            if ((_isBot[from] || _isBot[to]) && to == uniswapV2Pair) {
                _botFeeMultiply = _botIncreaseFee;
            }
            
            uint256 marketingFeeAmount = amount * marketingFeeList[feeIndex] * _botFeeMultiply / 100;
            uint256 devFeeAmount = amount * devFeeList[feeIndex] * _botFeeMultiply / 100;
            uint256 liquidityFeeAmount = amount * liquidityFeeList[feeIndex] * _botFeeMultiply / 100;
            uint256 BNBRewardsFeeAmount = amount * tokenRewardsFeeList[feeIndex] * _botFeeMultiply / 100;

            countMarketingFees += marketingFeeAmount;
            countDevFees += devFeeAmount;
            countLiquidityFees += liquidityFeeAmount;
            countRewardsFees += BNBRewardsFeeAmount;
            
            uint256 fees = 
                marketingFeeAmount + 
                devFeeAmount +
                liquidityFeeAmount +
                BNBRewardsFeeAmount;

            // if (automatedMarketMakerPairs[to]) {
            //     fees += amount.mul(1).div(100);
            // }
            amount = amount - fees;

            super._transfer(from, address(this), fees);
        }

        super._transfer(from, to, amount);

        try
            dividendTracker.setBalance(payable(from), balanceOf(from))
        {} catch {}
        try dividendTracker.setBalance(payable(to), balanceOf(to)) {} catch {}

        if (!swapping) {
            uint256 gas = gasForProcessing;

            try dividendTracker.process(gas) returns (
                uint256 iterations,
                uint256 claims,
                uint256 lastProcessedIndex
            ) {
                emit ProcessedDividendTracker(
                    iterations,
                    claims,
                    lastProcessedIndex,
                    true,
                    gas,
                    tx.origin
                );
            } catch {}
        }
    }

    function swapAndLiquify(uint256 tokens) private {
        if (tokens > balanceOf(address(this))) {
            emit SwapAndLiquify(0,0,0,false);
        }

        if (tokens > swapTokensAtAmountMax) {
            tokens = swapTokensAtAmountMax;
        }
        // split the contract balance into halves
        uint256 half = tokens.div(2);
        uint256 otherHalf = tokens.sub(half);

        // capture the contract's current ETH balance.
        // this is so that we can capture exactly the amount of ETH that the
        // swap creates, and not make the liquidity event include any ETH that
        // has been manually sent to the contract
        uint256 initialBalance = address(this).balance;

        // swap tokens for ETH
        swapTokensForEth(half, payable(address(this))); // <- this breaks the ETH -> HATE swap when swap+liquify is triggered

        countLiquidityFees -= half;

        // how much ETH did we just swap into?
        uint256 newBalance = address(this).balance.sub(initialBalance);

        // add liquidity to uniswap
        addLiquidity(otherHalf, newBalance);

        countLiquidityFees -= otherHalf;

        emit SwapAndLiquify(half, newBalance, otherHalf, true);
    }

    function swapAndSendDividendsMarketingDev(
        uint256 _dividendsFee,
        uint256 _marketingFee,
        uint256 _devFee
    ) private {
        if ((_dividendsFee + _marketingFee + _devFee) > balanceOf(address(this))) {
            emit SendDividends(
                _dividendsFee,
                _marketingFee,
                _devFee,
                false
            );
            return;
        }

        uint256 beforeSwap;
        uint256 afterSwapDelta;

        // avoid price impact errors with large transactions
        if (_dividendsFee > swapTokensAtAmountMax) {
            _dividendsFee = swapTokensAtAmountMax;
        }

        beforeSwap = address(this).balance;
        swapTokensForEth(_dividendsFee, payable(address(this)));
        afterSwapDelta = address(this).balance - beforeSwap;
        countRewardsFees -= _dividendsFee;
        uint256 BNBRewardsFeeBNB = afterSwapDelta;

        (bool success, ) = address(dividendTracker).call{
            value: BNBRewardsFeeBNB
        }("");

        if (_marketingFee > swapTokensAtAmountMax) {
            _marketingFee = swapTokensAtAmountMax;
        }
        beforeSwap = address(this).balance;
        swapTokensForEth(_marketingFee, payable(address(this)));
        afterSwapDelta = address(this).balance - beforeSwap;
        countMarketingFees -= _marketingFee;
        uint256 marketingFeesBNB = afterSwapDelta;
        (bool successMarketing, ) = address(_marketingWalletAddress).call{
            value: marketingFeesBNB
        }("");

        if (_devFee > swapTokensAtAmountMax) {
            _devFee = swapTokensAtAmountMax;
        }
        beforeSwap = address(this).balance;
        swapTokensForEth(_devFee, payable(address(this)));
        afterSwapDelta = address(this).balance - beforeSwap;
        countDevFees -= _devFee;
        uint256 devFeesBNB = afterSwapDelta;
        (bool successDev, ) = address(_devWalletAddress).call{
            value: devFeesBNB
        }("");

        emit SendDividends(
            BNBRewardsFeeBNB,
            marketingFeesBNB,
            devFeesBNB,
            success && successMarketing && successDev
        );
    }

    function swapTokensForEth(uint256 tokenAmount, address payable account) private {
        if(balanceOf(address(this)) < tokenAmount){
            tokenAmount = balanceOf(address(this));
        }

        // generate the uniswap pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = uniswapV2Router.WETH();

        _approve(address(this), address(uniswapV2Router), tokenAmount);

        // make the swap
        uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0, // accept any amount of ETH
            path,
            account,
            block.timestamp
        );
    }

    function addLiquidity(uint256 tokenAmount, uint256 ethAmount) private {
        // approve token transfer to cover all possible scenarios
        _approve(address(this), address(uniswapV2Router), tokenAmount);

        // add the liquidity
        uniswapV2Router.addLiquidityETH{value: ethAmount}(
            address(this),
            tokenAmount,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            deadAddress,
            block.timestamp
        );
    }

    // Anti-Bot
    function setAntiBotSystemEnable(bool _status) public onlyOwner {
        require(launchTime == 0, "Already launched, not necessary.");
        antibotSystemEnable = _status;
    }

    function setBotSettingTime(uint256 _val) public onlyOwner {
        require(launchTime == 0 && _val <= 5, "Already launched or max 5 minuts.");
        timeDetectBotSeconds = _val;
        timeAntiBot = 60 * _val;
    }

    function setBotFeeMultiplicator(uint256 _val) public onlyOwner {
        require(_val <= 3 && launchTime == 0, "max x3 and not launched");
        _botIncreaseFee = _val;
    }

    function excludeAntibot(address ac) public onlyOwner {
        require(_isBot[ac], "not bot");
        _isBot[ac] = false;
    }

    function isBot(address acc) public view returns(bool) {
        return _isBot[acc];
    }




    // Anti-Whale
    function setEnableAntiwhale(bool _val) public onlyOwner {
        enableAntiWhale = _val;
    }

      /**
    * @dev Returns the max transfer amount.
    */
    function maxTransferAmount() public view returns (uint256) {
        // we can either use a percentage of supply
        if(maxTransferAmountRate > 0){
            return totalSupply().mul(maxTransferAmountRate).div(10000);
        }
        // or we can just set an actual number
        return totalSupply().mul(100).div(10000);
    }

    function setMaxTransferAmountRate(uint256 _val) public onlyOwner {
        require(_val <= 500, "max 500");
        maxTransferAmountRate= _val;
    }

    // Payout Setting
    function updatePayoutToken(address token) public {
        require(balanceOf(msg.sender) > 0, "You must own more than zero $LemonSwap tokens to switch your payout token!");
        require(token != address(this));

        dividendTracker.updatePayoutToken(msg.sender, token);
        emit UpdatePayoutToken(msg.sender, token);
    }

    function getPayoutToken(address account) public view returns (address) {
        return dividendTracker.getPayoutToken(account);
    }

    function updateAllowTokens(address token, bool allow) public onlyOwner {
        require(token != address(this));

        dividendTracker.updateAllowTokens(token, allow);
        emit UpdateAllowTokens(token, allow);
    }

    function getAllowTokens(address token) public view returns (bool) {
        return dividendTracker.getAllowTokens(token);
    }

    function enableSwapAndLiquify(bool enabled) public onlyOwner {
        require(swapAndLiquifyEnabled != enabled);
        swapAndLiquifyEnabled = enabled;

        emit EnableSwapAndLiquify(enabled);
    }

     function setSwapTokensAmountMax(uint256 amount) public onlyOwner {
        require(amount > swapTokensAtAmount, "Max amount must be greater than minimum");
        swapTokensAtAmountMax = amount;
    }


    //Debug Purpose
    function getNativeBalance() external view returns (uint256){
        return balanceOf(address(this));
    }
    
    function getCountOfFeesToSwap() external view returns (uint256, uint256, uint256, uint256){
        return (countRewardsFees, countMarketingFees, countDevFees, countLiquidityFees);
    }
    
    function transferERC20Token(address tokenAddress, uint256 amount, address destination) external onlyOwner{
        ERC20(tokenAddress).transfer(destination, amount);
    }

}
