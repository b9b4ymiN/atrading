import { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "striped" | "bordered";
  compact?: boolean;
}

interface TableHeaderProps {
  children: ReactNode;
  sticky?: boolean;
}

interface TableBodyProps {
  children: ReactNode;
}

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  selected?: boolean;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  colSpan?: number;
}

export function Table({
  children,
  className = "",
  variant = "default",
  compact = false,
}: TableProps) {
  const variants = {
    default: "",
    striped: "[&_tbody_tr:nth-child(even)]:bg-bg-tertiary/30",
    bordered: "border border-border rounded-lg overflow-hidden",
  };

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden rounded-lg">
          <table
            className={`
              min-w-full text-sm
              ${variants[variant]}
              ${className}
            `}
          >
            {children}
          </table>
        </div>
      </div>
    </div>
  );
}

export function TableHeader({ children, sticky = false }: TableHeaderProps) {
  return (
    <thead
      className={`
        border-b border-border bg-bg-primary
        ${sticky ? "sticky top-0 z-10" : ""}
      `}
    >
      {children}
    </thead>
  );
}

export function TableBody({ children }: TableBodyProps) {
  return <tbody className="divide-y divide-border">{children}</tbody>;
}

export function TableRow({
  children,
  onClick,
  className = "",
  selected = false,
}: TableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={`
        hover:bg-bg-tertiary transition-all duration-200
        ${onClick ? "cursor-pointer active:bg-bg-elevated" : ""}
        ${selected ? "bg-brand-orange/10 border-l-2 border-brand-orange" : ""}
        ${className}
      `}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  children,
  className = "",
  align = "left",
  colSpan,
}: TableCellProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <th
      colSpan={colSpan}
      className={`
        px-3 py-3 sm:px-4 sm:py-4 font-semibold text-text-secondary
        text-[10px] sm:text-xs uppercase tracking-wider
        ${alignClass[align]}
        ${className}
        whitespace-nowrap
      `}
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className = "",
  align = "left",
  colSpan,
}: TableCellProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <td
      colSpan={colSpan}
      className={`
        px-3 py-3 sm:px-4 sm:py-4 text-text-primary
        ${alignClass[align]}
        ${className}
      `}
    >
      {children}
    </td>
  );
}

// Empty state component for tables
export function TableEmpty({
  message = "No data available",
  icon,
  action,
}: {
  message?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <tr>
      <td colSpan={100} className="px-4 py-12">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          {icon && (
            <div className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center text-text-tertiary">
              {icon}
            </div>
          )}
          <div className="space-y-2">
            <p className="text-text-secondary font-medium">{message}</p>
            {action && <div className="mt-4">{action}</div>}
          </div>
        </div>
      </td>
    </tr>
  );
}

// Table with loading state
export function TableLoading({ columns = 5, rows = 5 }: { columns?: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          {Array.from({ length: columns }).map((_, j) => (
            <td key={j} className="px-4 py-4">
              <div className="h-4 bg-bg-tertiary rounded skeleton" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
