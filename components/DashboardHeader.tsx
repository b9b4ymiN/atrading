import { apiFetch } from "@/lib/api-client";
import { endpoints } from "@/lib/api-client/endpoints";
import Link from "next/link";

async function DashboardHeader() {
  let balance: any = null;
  let balanceAmount = "Loading...";

  try {
    balance = await apiFetch(endpoints.balance(), { cacheSeconds: 5, tag: "balance" });
    // Try to extract total wallet balance
    if (balance?.data?.totalWalletBalance) {
      balanceAmount = `$${parseFloat(balance.data.totalWalletBalance).toFixed(2)}`;
    } else if (balance?.data?.availableBalance) {
      balanceAmount = `$${parseFloat(balance.data.availableBalance).toFixed(2)}`;
    }
  } catch (err) {
    balanceAmount = "Error";
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-border shadow-lg animate-slideInLeft">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-12">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 hover-lift group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-brand-orange via-brand-orange to-brand-orange-dark rounded-lg flex items-center justify-center shadow-md group-hover:shadow-glow-orange transition-all duration-300">
                <span className="text-black font-bold text-lg sm:text-xl">₿</span>
              </div>
              <span className="text-sm sm:text-base lg:text-lg font-bold text-white uppercase tracking-wide hidden xs:inline gradient-text">
                CRYPTO
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <NavLink href="/">Dashboard</NavLink>
              <NavLink href="/trade">Trade</NavLink>
              <NavLink href="/positions">Positions</NavLink>
              <NavLink href="/orders">Orders</NavLink>
              <NavLink href="/markets">Markets</NavLink>
              <NavLink href="/account">Account</NavLink>
              <NavLink href="/history">History</NavLink>
              <NavLink href="/analytics">Analytics</NavLink>
            </nav>
          </div>

          {/* Balance and Actions */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            {/* Balance Display */}
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-bg-secondary rounded-lg border border-border hover:border-border-hover shadow-sm hover:shadow-md transition-all duration-200">
              <span className="text-[10px] sm:text-xs text-text-secondary hidden sm:inline">Balance:</span>
              <span className="text-xs sm:text-sm font-bold gradient-text truncate max-w-[80px] sm:max-w-none">
                {balanceAmount}
              </span>
            </div>

            {/* Logout Button */}
            <form action="/api/session/logout" method="POST">
              <button
                type="submit"
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-bg-tertiary hover:bg-bg-elevated active:bg-border border border-border hover:border-border-hover rounded-lg transition-all duration-200 text-xs sm:text-sm text-white font-medium shadow-sm min-h-[36px] sm:min-h-[40px] touch-manipulation active:scale-[0.98]"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Navigation - Horizontal Scroll */}
        <nav className="lg:hidden mt-3 -mx-3 sm:-mx-4 px-3 sm:px-4 overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <div className="flex items-center gap-1 sm:gap-2 pb-1 min-w-max">
            <MobileNavLink href="/">Dashboard</MobileNavLink>
            <MobileNavLink href="/trade">Trade</MobileNavLink>
            <MobileNavLink href="/positions">Positions</MobileNavLink>
            <MobileNavLink href="/orders">Orders</MobileNavLink>
            <MobileNavLink href="/markets">Markets</MobileNavLink>
            <MobileNavLink href="/account">Account</MobileNavLink>
            <MobileNavLink href="/history">History</MobileNavLink>
            <MobileNavLink href="/analytics">Analytics</MobileNavLink>
          </div>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-2.5 xl:px-3 py-2 rounded-md text-xs xl:text-sm font-medium text-text-secondary hover:text-white hover:bg-bg-tertiary transition-all duration-200 whitespace-nowrap relative group"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-orange to-brand-orange-light group-hover:w-full transition-all duration-300" />
    </Link>
  );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-text-secondary hover:text-white hover:bg-bg-tertiary active:bg-bg-elevated transition-all duration-200 whitespace-nowrap border border-transparent hover:border-border min-h-[36px] flex items-center touch-manipulation active:scale-[0.98]"
    >
      {children}
    </Link>
  );
}

export default DashboardHeader;
