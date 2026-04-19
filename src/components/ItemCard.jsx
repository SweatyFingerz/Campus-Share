import { Tag, User, Clock, Phone } from "lucide-react";

export default function ItemCard({ item, actionButton, variant = "library" }) {
  const statusColors = {
    available: "bg-emerald-50 text-emerald-700 border-emerald-200",
    borrowed: "bg-amber-50 text-amber-700 border-amber-200",
    lost: "bg-red-50 text-red-700 border-red-200",
    found: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const statusLabel = item.status || (variant === "lostfound" ? item.type : "available");

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 overflow-hidden">
      {/* Card Header with gradient accent */}
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <div className="p-5">
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${statusColors[statusLabel] || statusColors.available}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1)}
          </span>
          {item.category && (
            <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
              <Tag size={12} />
              {item.category}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
          {item.name || item.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {item.description}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-4">
          {item.ownerName && (
            <span className="flex items-center gap-1">
              <User size={12} />
              {item.ownerName}
            </span>
          )}
          {item.ownerEmail && (
            <a
              href={`mailto:${item.ownerEmail}`}
              className="flex items-center gap-1 text-indigo-500 hover:text-indigo-700 transition-colors"
            >
              ✉ {item.ownerEmail}
            </a>
          )}
          {item.userName && (
            <span className="flex items-center gap-1">
              <User size={12} />
              {item.userName}
            </span>
          )}
          {item.userEmail && (
            <a
              href={`mailto:${item.userEmail}`}
              className="flex items-center gap-1 text-indigo-500 hover:text-indigo-700 transition-colors"
            >
              ✉ {item.userEmail}
            </a>
          )}
          {item.currentBorrowerName && (
            <span className="flex items-center gap-1 text-amber-500">
              <Clock size={12} />
              Held by: {item.currentBorrowerName}
            </span>
          )}
          {item.location && (
            <span className="flex items-center gap-1">
              📍 {item.location}
            </span>
          )}
          {item.contactNumber && (
            <span className="flex items-center gap-1 text-emerald-600">
              <Phone size={12} />
              {item.contactNumber}
            </span>
          )}
        </div>

        {/* Action Button */}
        {actionButton && <div className="pt-2 border-t border-gray-50">{actionButton}</div>}
      </div>
    </div>
  );
}
