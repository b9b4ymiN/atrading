import { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: ReactNode;
}

interface TableBodyProps {
  children: ReactNode;
}

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export function Table({ children, className = "" }: TableProps) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 scrollbar-thin scrollbar-thumb-[#2a2a2a] scrollbar-track-transparent">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden">
          <table className={`min-w-full text-sm ${className}`}>
            {children}
          </table>
        </div>
      </div>
    </div>
  );
}

export function TableHeader({ children }: TableHeaderProps) {
  return (
    <thead className="border-b border-[#2a2a2a] bg-[#0a0a0a]">
      {children}
    </thead>
  );
}

export function TableBody({ children }: TableBodyProps) {
  return (
    <tbody className="divide-y divide-[#2a2a2a]">
      {children}
    </tbody>
  );
}

export function TableRow({ children, onClick, className = "" }: TableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={`hover:bg-[#1a1a1a] transition-colors ${onClick ? "cursor-pointer active:bg-[#252525]" : ""} ${className}`}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = "", align = "left" }: TableCellProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <th className={`px-3 py-3 sm:px-4 sm:py-4 font-medium text-[#a0a0a0] text-xs uppercase tracking-wider ${alignClass[align]} ${className} whitespace-nowrap`}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = "", align = "left" }: TableCellProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <td className={`px-3 py-3 sm:px-4 sm:py-4 text-white ${alignClass[align]} ${className}`}>
      {children}
    </td>
  );
}
