import { EducationGuide } from '../types';

export const EDUCATION_GUIDES: Record<string, EducationGuide> = {
  'beginners-guide': {
    id: 'beginners-guide',
    title: 'Financial Markets: Complete Beginners Guide',
    category: 'Market Fundamentals',
    readTime: '8 min read',
    summary: 'Master the core building blocks of global financial markets, asset classes, compound growth, and risk management.',
    sections: [
      {
        title: '1. What Are Financial Markets?',
        content: `Financial markets bring buyers and sellers together to trade financial assets such as stocks, bonds, currencies, and commodities. Without financial markets, companies could not easily raise money to expand factories, governments could not finance infrastructure projects, and individuals could not save for retirement.

Markets operate on two main levels: the primary market (where new securities are issued, like an Initial Public Offering or IPO) and the secondary market (where investors buy and sell existing securities among themselves, such as on the Nigerian Exchange or the New York Stock Exchange).`,
        keyTakeaway: 'Financial markets channel capital from savers and investors to companies and governments that need funding to grow.',
      },
      {
        title: '2. The Four Primary Asset Classes',
        content: `Investors distribute capital across four fundamental asset classes:
• Equities (Stocks): Ownership shares in corporations. Higher potential return, higher short-term price volatility.
• Fixed Income (Bonds & Treasuries): Loans made by investors to governments or companies that pay periodic interest. Focuses on income generation and capital preservation.
• Currencies (Foreign Exchange / FX): Cash in different currencies traded globally. Influenced by inflation, trade balances, and central bank interest rates.
• Commodities: Physical commodities like oil, gold, copper, and agriculture. Frequently used as inflation hedges.`,
        keyTakeaway: 'Diversifying across different asset classes reduces overall portfolio risk while preserving growth potential.',
      },
      {
        title: '3. The Magic of Compounding',
        content: `Compound interest is earning returns on your original investment plus all accumulated returns from prior periods. Albert Einstein famously called compound interest the "eighth wonder of the world." 

For example, an initial investment of $1,000 growing at an average annual return of 8% will grow to $2,158 in 10 years, $4,660 in 20 years, and $10,062 in 30 years—without adding an extra penny. Starting early gives time maximum leverage.`,
        keyTakeaway: 'Time in the market beats timing the market due to the exponential math of compound interest.',
      },
      {
        title: '4. Essential Risk Management Principles',
        content: `Every financial return comes with risk. Risk management is not about eliminating risk, but understanding and controlling it. Always maintain an emergency liquid fund covering 3–6 months of living expenses before committing money to market investments.`,
        keyTakeaway: 'Never invest capital you need in the next 12 to 24 months into volatile growth assets.',
      },
    ],
    keyTerms: [
      { term: 'Liquidity', definition: 'How quickly an asset can be converted into cash without affecting its market price.' },
      { term: 'Volatility', definition: 'The degree of variation of a trading price series over time.' },
      { term: 'Primary Market', definition: 'Market where new securities are created and sold for the first time.' },
      { term: 'Inflation', definition: 'The rate at which the general level of prices for goods and services rises, eroding purchasing power.' },
    ],
  },

  'investment-guide': {
    id: 'investment-guide',
    title: 'Principles of Modern Portfolio Strategy & Asset Allocation',
    category: 'Portfolio Management',
    readTime: '10 min read',
    summary: 'Learn how professional wealth managers construct resilient portfolios, balance risk and return, and apply Dollar-Cost Averaging.',
    sections: [
      {
        title: '1. Asset Allocation & Modern Portfolio Theory',
        content: `Asset allocation is the strategy of balancing risk and reward by adjusting the percentage of each asset class in an investment portfolio according to your risk tolerance, financial goals, and investment horizon. Modern Portfolio Theory (MPT), pioneered by Harry Markowitz, proves that combining non-correlated assets creates a portfolio with higher expected returns for a given level of risk.`,
        keyTakeaway: 'Up to 90% of long-term investment performance variability comes from asset allocation rather than individual stock picking.',
      },
      {
        title: '2. Dollar-Cost Averaging (DCA)',
        content: `Dollar-Cost Averaging involves investing a fixed sum of money at regular intervals (e.g., monthly), regardless of market highs or lows. When prices are high, your fixed sum buys fewer shares; when prices drop, it automatically buys more shares. DCA removes emotion, eliminates market-timing mistakes, and lowers your average purchase price over time.`,
        keyTakeaway: 'Consistent, disciplined monthly investing builds wealth far more reliably than trying to time market tops and bottoms.',
      },
      {
        title: '3. Fundamental vs. Technical Analysis',
        content: `Investors evaluate market opportunities using two complementary approaches:
• Fundamental Analysis: Examining company financial statements (revenue, profit margins, balance sheet strength), industry health, macroeconomic trends, and competitive moats to determine intrinsic value.
• Technical Analysis: Studying price charts, volume patterns, moving averages, and market indicators to identify supply/demand momentum and entry/exit timing.`,
        keyTakeaway: 'Use fundamental analysis to decide WHAT to buy, and technical analysis to decide WHEN to buy.',
      },
      {
        title: '4. Portfolio Rebalancing',
        content: `Over time, outperforming assets will grow to represent a larger percentage of your portfolio than originally intended. Periodic rebalancing (quarterly or annually) involves selling a portion of overweighted assets and buying underweighted assets, forcing you to disciplinedly "sell high and buy low."`,
        keyTakeaway: 'Rebalancing maintains your desired risk profile and captures profits systematically.',
      },
    ],
    keyTerms: [
      { term: 'Correlation', definition: 'A statistic measuring how two securities move in relation to one another.' },
      { term: 'Dollar-Cost Averaging', definition: 'The practice of investing fixed monetary amounts on a set schedule regardless of asset price.' },
      { term: 'Intrinsic Value', definition: 'The calculated true economic worth of a company based on fundamental cash flow analysis.' },
      { term: 'Rebalancing', definition: 'Realignment of portfolio weightings by buying or selling assets periodically.' },
    ],
  },

  'fx-for-beginners': {
    id: 'fx-for-beginners',
    title: 'Foreign Exchange (FX) Markets for Beginners',
    category: 'Currencies & Macro',
    readTime: '7 min read',
    summary: 'A beginner-friendly breakdown of currency pairs, exchange rate determinants, central bank policy, and trade mechanics.',
    sections: [
      {
        title: '1. How the Global FX Market Operates',
        content: `The Foreign Exchange (FX) market is the world\'s largest financial market, with over $7.5 trillion traded daily. It operates 24 hours a day, 5 days a week across major financial centers: London, New York, Tokyo, Sydney, and Singapore. Unlike stock markets, FX has no centralized exchange; it is a decentralized Over-The-Counter (OTC) network of commercial banks, central banks, institutions, and brokers.`,
        keyTakeaway: 'FX is continuous, highly liquid, and driven by global international trade and capital flows.',
      },
      {
        title: '2. Understanding Currency Pairs & Quotes',
        content: `Currencies are always quoted in pairs, such as USD/NGN or EUR/USD. 
• The first currency listed is the Base Currency (e.g., USD in USD/NGN).
• The second currency is the Quote or Counter Currency (e.g., NGN in USD/NGN).

If USD/NGN is quoted at 1,525.00, it means 1 US Dollar is worth 1,525 Nigerian Naira. If the quote increases to 1,550.00, the USD has appreciated and the NGN has depreciated.`,
        keyTakeaway: 'In FX quotes, you are buying the base currency while selling the quote currency.',
      },
      {
        title: '3. What Moves Exchange Rates?',
        content: `Exchange rates are determined by real-time supply and demand, influenced by four macro drivers:
1. Differential Interest Rates: Higher central bank interest rates attract foreign yield-seeking capital.
2. Inflation Rates: Higher inflation erodes a currency\'s purchasing power relative to foreign trade partners.
3. Current Account Balances: Countries exporting more than they import generate structural demand for their currency.
4. Foreign Exchange Reserves & Intervention: Central banks (such as the CBN) buy or sell foreign reserves to stabilize local exchange rates.`,
        keyTakeaway: 'Central bank rate decisions and trade balances are the primary structural drivers of currency trends.',
      },
    ],
    keyTerms: [
      { term: 'Base Currency', definition: 'The first currency appearing in a currency pair quote.' },
      { term: 'Quote Currency', definition: 'The second currency in a pair quote, representing how much is needed to buy 1 unit of base currency.' },
      { term: 'Bid / Ask Spread', definition: 'The difference between the price a buyer pays and the price a seller receives.' },
      { term: 'FX Reserves', definition: 'Foreign currency assets held by central banks to back liabilities and influence monetary policy.' },
    ],
  },

  'stocks-for-beginners': {
    id: 'stocks-for-beginners',
    title: 'Understanding Stocks & Equity Markets',
    category: 'Equities',
    readTime: '8 min read',
    summary: 'Learn what shares represent, how stock exchanges work, earning dividends, and evaluating company valuations.',
    sections: [
      {
        title: '1. What Is a Share of Stock?',
        content: `A share of stock represents fractional ownership in a business corporation. When you buy a share of Dangote Cement, Apple, or GTCO, you own a legal piece of that enterprise. As an equity holder, you participate in the company\'s net profits (via dividends and capital appreciation) and hold voting rights on major corporate matters.`,
        keyTakeaway: 'Stocks are real equity ownership in productive businesses, not speculative casino chips.',
      },
      {
        title: '2. Two Ways to Earn Returns From Stocks',
        content: `Stockholders build wealth through two distinct mechanisms:
• Capital Appreciation: Selling shares at a higher price than you purchased them (e.g., buying at $100 and selling at $150).
• Dividend Income: Periodic cash payouts made by profitable corporations directly to shareholders from cash profits. Dividend yield measures annual dividend payouts as a percentage of share price.`,
        keyTakeaway: 'Combining capital growth with reinvested dividends accelerates compounding velocity over decades.',
      },
      {
        title: '3. Market Capitalization & Valuation Metrics',
        content: `Market Capitalization (Market Cap) is the total dollar market value of a company\'s outstanding shares (Share Price × Total Shares). Companies are grouped into:
• Large-Cap ($10B+ / NGX Tier 1): Stable, established leaders.
• Mid-Cap ($2B–$10B): Growing companies with balanced stability.
• Small-Cap (<$2B): High growth potential with higher risk.

The Price-to-Earnings (P/E) ratio measures how much investors pay per $1 of annual earnings. A lower P/E relative to industry peers may indicate undervaluation.`,
        keyTakeaway: 'Always look at market cap and valuation metrics rather than raw share price alone.',
      },
    ],
    keyTerms: [
      { term: 'Market Capitalization', definition: 'Total market value of a company\'s equity (Share Price × Outstanding Shares).' },
      { term: 'Dividend Yield', definition: 'Annual dividend payout divided by the current share price, expressed as a percentage.' },
      { term: 'P/E Ratio', definition: 'Ratio of share price to annual earnings per share, used to assess relative value.' },
      { term: 'IPO', definition: 'Initial Public Offering—when a private company lists its shares publicly on an exchange for the first time.' },
    ],
  },

  'bonds-funds-for-beginners': {
    id: 'bonds-funds-for-beginners',
    title: 'Bonds & Mutual Funds: Fixed Income Fundamentals',
    category: 'Fixed Income & Debt',
    readTime: '9 min read',
    summary: 'Discover sovereign treasury bills, corporate bonds, yield curves, money market funds, and debt securities.',
    sections: [
      {
        title: '1. What Are Bonds?',
        content: `A bond is an IOU issued by a borrower (such as the Federal Government of Nigeria, the US Treasury, or a corporation) to raise capital. When you buy a bond, you are lending money to the issuer. In return, the issuer agrees to pay you regular fixed interest (coupon payments) and return the original principal balance (face value) at maturity.`,
        keyTakeaway: 'Bonds provide predictable interest income and act as a defensive ballast in volatile market downturns.',
      },
      {
        title: '2. Inverse Relationship: Price vs. Yield',
        content: `A fundamental rule of bond investing is that bond prices and market yield move in opposite directions:
• When interest rates rise, existing bond prices fall (because newer bonds offer higher interest).
• When interest rates fall, existing bond prices rise.

Short-term paper (like 91-day Treasury Bills) carries low interest rate risk, while 20-year sovereign bonds carry higher sensitivity to interest rate shifts.`,
        keyTakeaway: 'Bond prices move inversely to interest rates—understanding yields is key to debt market investing.',
      },
      {
        title: '3. Mutual Funds & Collective Investment Schemes',
        content: `A mutual fund pools money from thousands of retail investors to purchase a professionally managed portfolio of stocks, bonds, or money market instruments. Money Market Funds (MMFs) invest in low-risk short-term debt and offer daily liquidity, making them popular high-yield cash preservation tools.`,
        keyTakeaway: 'Mutual funds give individual investors instant diversification and professional asset management.',
      },
    ],
    keyTerms: [
      { term: 'Coupon Rate', definition: 'The fixed annual interest rate paid by a bond issuer on its face value.' },
      { term: 'Maturity Date', definition: 'The date on which the principal amount of a bond is repaid to the investor.' },
      { term: 'Treasury Bill (T-Bill)', definition: 'Short-term government debt security backed by the sovereign state.' },
      { term: 'NAV (Net Asset Value)', definition: 'The per-share value of a mutual fund calculated daily.' },
    ],
  },

  'etfs-for-beginners': {
    id: 'etfs-for-beginners',
    title: 'Exchange Traded Funds (ETFs) Demystified',
    category: 'Index Investing',
    readTime: '8 min read',
    summary: 'Why low-cost index ETFs have revolutionized investing for millions of retail and institutional participants.',
    sections: [
      {
        title: '1. What Is an ETF?',
        content: `An Exchange Traded Fund (ETF) is a basket of securities that trades on a stock exchange just like a single share of stock. Unlike traditional mutual funds which are priced once at the end of the day, ETFs can be bought and sold continuously throughout market trading hours at real-time market prices.`,
        keyTakeaway: 'ETFs combine the diversification benefits of mutual funds with the trading flexibility and low cost of stocks.',
      },
      {
        title: '2. Passive Index Tracking vs. Active Funds',
        content: `Most ETFs are passive funds designed to replicate the performance of a specific market index (e.g., S&P 500 ETF, NGX 30 ETF, or Gold Bullion ETF). Because passive ETFs don\'t require expensive teams of stock analysts, their annual expense ratios are significantly lower—often 0.03% to 0.15% per year compared to 1.5%+ for actively managed mutual funds.`,
        keyTakeaway: 'Low expense ratios mean more of your money stays invested and compounding over time.',
      },
      {
        title: '3. Types of ETFs & Global Access',
        content: `Today, ETFs allow instant access to virtually any asset class or thematic vertical:
• Broad Index ETFs (S&P 500, MSCI Emerging Markets)
• Sector ETFs (Technology, Clean Energy, Healthcare)
• Commodity ETFs (Gold, Crude Oil)
• Fixed Income ETFs (Global Sovereign Bonds, High Yield Corporate Bonds)`,
        keyTakeaway: 'A single broad market ETF purchase grants instant ownership in hundreds of leading companies.',
      },
    ],
    keyTerms: [
      { term: 'Expense Ratio', definition: 'The annual fee expressed as a percentage of total assets charged by funds to manage your money.' },
      { term: 'Passive Management', definition: 'Investment strategy that aims to mirror a market index rather than beat it.' },
      { term: 'Tracking Error', definition: 'The divergence between an ETF\'s price performance and its benchmark index.' },
      { term: 'Index', definition: 'A statistical measure of a group of stocks representing a segment of the financial market.' },
    ],
  },
};
