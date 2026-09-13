# Smart Contract & Token Decimal Safety

1. **Reentrancy**:
   - Follow the Checks-Effects-Interactions (CEI) pattern strictly.
   - Apply OpenZeppelin's `ReentrancyGuard` (`nonReentrant`) on external state-changing calls.

2. **Token Decimal Normalisation**:
   - Never assume ERC-20 tokens use 18 decimals (e.g. USDC has 6, WBTC has 8).
   - Perform runtime decimal lookups and safe math normalisation to avoid 10^12 precision errors.
