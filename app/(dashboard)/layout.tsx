import { apiFetch } from "@/lib/api-client";
import { endpoints } from "@/lib/api-client/endpoints";
import Link from "next/link";
import { redirect } from "next/navigation";

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
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#2a2a2a] shadow-lg">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-12">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="w-8 h-8 sm:w-8 sm:h-8 bg-gradient-to-br from-[#FF8700] to-[#e67700] rounded-lg flex items-center justify-center shadow-md">
                <span className="text-black font-bold text-lg sm:text-lg">₿</span>
              </div>
              <span className="text-sm sm:text-base lg:text-lg font-bold text-white uppercase tracking-wide hidden xs:inline">
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
            <div className="flex items-center gap-1.5 p-2 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-[#141414] rounded-lg border border-[#2a2a2a] shadow-sm">
              <span className="text-[10px] sm:text-xs text-[#a0a0a0] hidden sm:inline">Balance:</span>
              <span className="text-xs sm:text-sm font-bold text-[#FF8700] truncate max-w-[80px] sm:max-w-none">
                {balanceAmount}
              </span>
            </div>
            
            {/* Logout Button */}
            <form action="/api/session/logout" method="POST">
              <button
                type="submit"
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] active:bg-[#333] border border-[#2a2a2a] rounded-lg transition-all text-xs sm:text-sm text-white font-medium shadow-sm min-h-[36px] sm:min-h-[40px] touch-manipulation"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Navigation - Horizontal Scroll */}
        <nav className="lg:hidden mt-3 -mx-3 sm:-mx-4 px-3 sm:px-4 overflow-x-auto scrollbar-thin scrollbar-thumb-[#2a2a2a] scrollbar-track-transparent">
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
      className="px-2.5 xl:px-3 py-2 rounded-md text-xs xl:text-sm font-medium text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a] transition-all whitespace-nowrap"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a] active:bg-[#252525] transition-all whitespace-nowrap border border-transparent hover:border-[#2a2a2a] min-h-[36px] flex items-center touch-manipulation"
    >
      {children}
    </Link>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <DashboardHeader />
      <main className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {children}
      </main>
    </div>
  );
}
