import { useToast } from "../context/ToastContext";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function Toast() {
  const { toast, removeToast } = useToast();

  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border max-w-sm w-full ${
          isError
            ? "bg-red-50 text-red-700 border-red-200 shadow-red-500/10"
            : "bg-emerald-50 text-emerald-800 border-emerald-200 shadow-emerald-500/10"
        }`}
      >
        <div className="flex-shrink-0 mt-0.5">
          {isError ? (
            <AlertCircle size={18} className="text-red-500" />
          ) : (
            <CheckCircle2 size={18} className="text-emerald-500" />
          )}
        </div>
        <p className="flex-1 text-sm font-medium leading-relaxed pr-2">
          {toast.message}
        </p>
        <button
          onClick={removeToast}
          className={`flex-shrink-0 p-1 rounded-lg transition-colors ${
            isError ? "hover:bg-red-100 text-red-500" : "hover:bg-emerald-100 text-emerald-600"
          }`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
