import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02]",
  secondary:
    "bg-gray-100 text-gray-700 hover:bg-gray-200",
  danger:
    "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.02]",
  success:
    "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02]",
  ghost:
    "text-gray-600 hover:bg-gray-100",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-xl
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
