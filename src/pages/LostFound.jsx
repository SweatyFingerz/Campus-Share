import { useState, useEffect, useMemo, useCallback } from "react";
import { useItemContext } from "../context/ItemContext";
import { useAuth } from "../hooks/useAuth";
import ItemCard from "../components/ItemCard";
import Modal from "../components/Modal";
import Button from "../components/Button";
import { Plus, Search, Loader2, MapPin, AlertCircle, Phone } from "lucide-react";

export default function LostFound() {
  const {
    lostFoundPosts,
    loading,
    error,
    fetchLostFoundPosts,
    addLostFoundPost,
    updateLostFoundPost,
  } = useItemContext();

  const { user, isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "lost",
    location: "",
    contactNumber: "",
  });

  useEffect(() => {
    fetchLostFoundPosts();
  }, [fetchLostFoundPosts]);

  // Memoized filtered posts
  const filteredPosts = useMemo(() => {
    return lostFoundPosts.filter((post) => {
      const matchesSearch =
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || post.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [lostFoundPosts, searchQuery, typeFilter]);

  const handleAddPost = useCallback(async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await addLostFoundPost(formData);
      setShowModal(false);
      setFormData({ title: "", description: "", type: "lost", location: "", contactNumber: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  }, [formData, addLostFoundPost]);

  const handleResolve = useCallback(async (postId) => {
    try {
      await updateLostFoundPost(postId, { resolved: true });
    } catch (err) {
      console.error(err);
    }
  }, [updateLostFoundPost]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Lost & Found</h1>
            <p className="text-gray-500 mt-1">
              Post about lost items or report something you've found
            </p>
          </div>
          {isAuthenticated && (
            <Button onClick={() => setShowModal(true)}>
              <Plus size={18} />
              Create Post
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="lf-search"
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
              />
            </div>

            {/* Type Filter Buttons */}
            <div className="flex gap-2">
              {[
                { value: "all", label: "All" },
                { value: "lost", label: "🔴 Lost" },
                { value: "found", label: "🟢 Found" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTypeFilter(opt.value)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    typeFilter === opt.value
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Posts */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-indigo-500" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No posts yet</h3>
            <p className="text-gray-500 text-sm">
              {searchQuery || typeFilter !== "all"
                ? "Try adjusting your search"
                : "Be the first to post!"}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <ItemCard
                key={post.id}
                item={{ ...post, status: post.type }}
                variant="lostfound"
                actionButton={
                  isAuthenticated && post.userId === user?.uid && !post.resolved ? (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleResolve(post.id)}
                      className="mt-2 w-full"
                    >
                      Mark as Resolved
                    </Button>
                  ) : post.resolved ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold py-2">
                      ✓ Resolved
                    </span>
                  ) : null
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Lost & Found Post"
      >
        <form onSubmit={handleAddPost} className="space-y-4">
          {/* Type Toggle */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Post Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, type: "lost" }))}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  formData.type === "lost"
                    ? "bg-red-50 text-red-700 border-2 border-red-200"
                    : "bg-gray-50 text-gray-500 border-2 border-transparent hover:bg-gray-100"
                }`}
              >
                🔴 I Lost Something
              </button>
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, type: "found" }))}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  formData.type === "found"
                    ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-200"
                    : "bg-gray-50 text-gray-500 border-2 border-transparent hover:bg-gray-100"
                }`}
              >
                🟢 I Found Something
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Title
            </label>
            <input
              id="lf-title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g., Blue Backpack"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              id="lf-description"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData((p) => ({ ...p, description: e.target.value }))
              }
              rows={3}
              placeholder="Describe the item — color, brand, distinguishing features..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Location
            </label>
            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="lf-location"
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, location: e.target.value }))
                }
                placeholder="e.g., Library 2nd Floor"
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Contact Number <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Phone
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="lf-contact"
                type="tel"
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, contactNumber: e.target.value }))
                }
                placeholder="e.g., +1 234 567 8900"
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={formLoading} className="flex-1">
              Post
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
