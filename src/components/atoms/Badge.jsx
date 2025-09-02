import { cn } from "@/utils/cn"

const Badge = ({ className, variant = "default", children, ...props }) => {
const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary-100 text-primary-700",
    accent: "bg-amber-100 text-amber-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    work: "bg-purple-100 text-purple-700",
    personal: "bg-green-100 text-green-700",
    urgent: "bg-red-100 text-red-700",
    critical: "bg-red-600 text-white shadow-lg ring-2 ring-red-200",
    "high-priority": "bg-orange-500 text-white shadow-md",
    overdue: "bg-red-800 text-white shadow-lg animate-pulse",
    "due-soon": "bg-yellow-500 text-white shadow-md"
  }
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge