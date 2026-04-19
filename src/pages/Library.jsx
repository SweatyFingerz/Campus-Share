import { useState, useEffect, useMemo, useCallback } from "react";
import { useItemContext } from "../context/ItemContext";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import ItemCard from "../components/ItemCard";
import Modal from "../components/Modal";
import Button from "../components/Button";
import { Plus, Search, Filter, Loader2, Package } from "lucide-react";

export default function Library() {
  const {
    libraryItems,
    loading,
    error,
    fetchLibraryItems,
    addLibraryItem,
    createItemRequest,
  } = useItemContext();

  const { user, isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formLoading, setFormLoading] = useState(false);
  const [requestingId, setRequestingId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Tools",
  });

  useEffect(() => {
    fetchLibraryItems();
  }, [fetchLibraryItems]);

  const categories = ["Tools", "Textbooks", "Electronics", "Sports", "Kitchen", "Other"];

  // Memoized filtered items to prevent re-renders
  const filteredItems = useMemo(() => {
    return libraryItems.filter((item) => {
      const matchesSearch =
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [libraryItems, searchQuery, categoryFilter, statusFilter]);

  const { addToast } = useToast();

  const handleAddItem = useCallback(async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await addLibraryItem(formData);
      setShowModal(false);
      setFormData({ name: "", description: "", category: "Tools" });
      addToast("Item listed successfully!");
    } catch (err) {
      console.error(err);
      addToast(err.message || "Failed to list item", "error");
    } finally {
      setFormLoading(false);
    }
  }, [formData, addLibraryItem, addToast]);

  const handleRequestItem = useCallback(async (item) => {
    setRequestingId(item.id);
    try {
      await createItemRequest(item.id, item.name, item.ownerId);
    } catch (err) {
      console.error(err);
    } finally {
      setRequestingId(null);
    }
  }, [createItemRequest]);

  const renderActionButton = useCallback((item) => {
    if (!isAuthenticated) return null;
    if (item.ownerId === user?.uid) {
      return (
        <span className="text-xs text-gray-400 font-medium py-2 block">Your listing</span>
      );
    }
    if (item.status === "available") {
      return (
        <Button
          size="sm"
          onClick={() => handleRequestItem(item)}
          loading={requestingId === item.id}
          className="mt-2 w-full"
        >
          Request to Borrow
        </Button>
      );
    }
    if (item.status === "borrowed") {
      if (item.currentBorrowerId === user?.uid) {
        return (
          <span className="text-xs text-amber-600 font-medium py-2 block">
            You currently have this item
          </span>
        );
      }
      return (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => handleRequestItem(item)}
          loading={requestingId === item.id}
          className="mt-2 w-full"
        >
          Request Handoff
        </Button>
      );
    }
    return null;
  }, [isAuthenticated, user, requestingId, handleRequestItem]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Item Library</h1>
            <p className="text-gray-500 mt-1">
              Browse and borrow items from your campus community
            </p>
          </div>
          {isAuthenticated && (
            <Button onClick={() => setShowModal(true)}>
              <Plus size={18} />
              List an Item
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="library-search"
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                id="library-category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <select
              id="library-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="borrowed">Borrowed</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-indigo-500" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No items found</h3>
            <p className="text-gray-500 text-sm">
              {searchQuery || categoryFilter !== "all"
                ? "Try adjusting your filters"
                : "Be the first to list an item!"}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                actionButton={renderActionButton(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="List a New Item"
      >
        <form onSubmit={handleAddItem} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Item Name
            </label>
            <input
              id="add-item-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="e.g., Soldering Iron"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              id="add-item-description"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData((p) => ({ ...p, description: e.target.value }))
              }
              rows={3}
              placeholder="Describe the item, condition, etc."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Category
            </label>
            <select
              id="add-item-category"
              value={formData.category}
              onChange={(e) =>
                setFormData((p) => ({ ...p, category: e.target.value }))
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={formLoading} className="flex-1">
              List Item
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
