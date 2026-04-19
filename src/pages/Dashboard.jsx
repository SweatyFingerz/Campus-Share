import { useState, useEffect, useCallback } from "react";
import { useItemContext } from "../context/ItemContext";
import { useAuth } from "../hooks/useAuth";
import ItemCard from "../components/ItemCard";
import Button from "../components/Button";
import {
  Package,
  BookOpen,
  Clock,
  MapPin,
  Check,
  X,
  Undo2,
  Trash2,
  Loader2,
} from "lucide-react";

const TABS = [
  { key: "listings", label: "My Listings", icon: <Package size={16} /> },
  { key: "borrowing", label: "Currently Borrowing", icon: <BookOpen size={16} /> },
  { key: "requests", label: "Pending Requests", icon: <Clock size={16} /> },
  { key: "lostfound", label: "My L&F Posts", icon: <MapPin size={16} /> },
];

export default function Dashboard() {
  const { user } = useAuth();
  const {
    loading,
    error,
    fetchLibraryItems,
    fetchItemRequests,
    fetchLostFoundPosts,
    myListings,
    currentlyBorrowing,
    pendingRequests,
    myLostFoundPosts,
    handleRequest,
    returnItem,
    deleteLibraryItem,
    deleteLostFoundPost,
  } = useItemContext();

  const [activeTab, setActiveTab] = useState("listings");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchLibraryItems();
    fetchItemRequests();
    fetchLostFoundPosts();
  }, [fetchLibraryItems, fetchItemRequests, fetchLostFoundPosts]);

  const onApprove = useCallback(async (req) => {
    setActionLoading(req.id);
    try {
      await handleRequest(req.id, "approved", req.itemId, req.requesterId, req.requesterName);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }, [handleRequest]);

  const onReject = useCallback(async (req) => {
    setActionLoading(req.id);
    try {
      await handleRequest(req.id, "rejected", req.itemId, req.requesterId, req.requesterName);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }, [handleRequest]);

  const onReturnItem = useCallback(async (itemId) => {
    setActionLoading(itemId);
    try {
      await returnItem(itemId);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }, [returnItem]);

  const onDeleteListing = useCallback(async (itemId) => {
    setActionLoading(itemId);
    try {
      await deleteLibraryItem(itemId);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }, [deleteLibraryItem]);

  const onDeleteLfPost = useCallback(async (postId) => {
    setActionLoading(postId);
    try {
      await deleteLostFoundPost(postId);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }, [deleteLostFoundPost]);

  const tabCounts = {
    listings: myListings.length,
    borrowing: currentlyBorrowing.length,
    requests: pendingRequests.length,
    lostfound: myLostFoundPosts.length,
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-indigo-500" />
        </div>
      );
    }

    switch (activeTab) {
      case "listings":
        return myListings.length === 0 ? (
          <EmptyState icon={<Package size={40} />} message="You haven't listed any items yet." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myListings.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                actionButton={
                  <div className="flex gap-2 mt-2">
                    {item.status === "available" && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onDeleteListing(item.id)}
                        loading={actionLoading === item.id}
                        className="flex-1"
                      >
                        <Trash2 size={14} />
                        Remove
                      </Button>
                    )}
                    {item.status === "borrowed" && (
                      <span className="text-xs text-amber-600 font-medium py-2">
                        Lent to {item.currentBorrowerName}
                      </span>
                    )}
                  </div>
                }
              />
            ))}
          </div>
        );

      case "borrowing":
        return currentlyBorrowing.length === 0 ? (
          <EmptyState icon={<BookOpen size={40} />} message="You're not borrowing any items." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentlyBorrowing.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                actionButton={
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => onReturnItem(item.id)}
                    loading={actionLoading === item.id}
                    className="mt-2 w-full"
                  >
                    <Undo2 size={14} />
                    Return Item
                  </Button>
                }
              />
            ))}
          </div>
        );

      case "requests":
        return pendingRequests.length === 0 ? (
          <EmptyState icon={<Clock size={40} />} message="No pending requests." />
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-gray-900">{req.itemName}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Requested by{" "}
                    <span className="font-semibold text-indigo-600">
                      {req.requesterName}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => onApprove(req)}
                    loading={actionLoading === req.id}
                  >
                    <Check size={14} />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onReject(req)}
                    loading={actionLoading === req.id}
                  >
                    <X size={14} />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        );

      case "lostfound":
        return myLostFoundPosts.length === 0 ? (
          <EmptyState icon={<MapPin size={40} />} message="No lost & found posts yet." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myLostFoundPosts.map((post) => (
              <ItemCard
                key={post.id}
                item={{ ...post, status: post.type }}
                variant="lostfound"
                actionButton={
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDeleteLfPost(post.id)}
                    loading={actionLoading === post.id}
                    className="mt-2 w-full"
                  >
                    <Trash2 size={14} />
                    Delete Post
                  </Button>
                }
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, <span className="font-semibold text-indigo-600">{user?.displayName}</span>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                activeTab === tab.key
                  ? "bg-indigo-50 border-indigo-200 shadow-sm"
                  : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activeTab === tab.key
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.icon}
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900">{tabCounts[tab.key]}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{tab.label}</p>
            </button>
          ))}
        </div>

        {/* Tab Navigation (mobile) */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.key
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tabCounts[tab.key] > 0 && (
                <span
                  className={`ml-1 px-1.5 py-0.5 text-xs rounded-full font-bold ${
                    activeTab === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tabCounts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
}

function EmptyState({ icon, message }) {
  return (
    <div className="text-center py-16">
      <div className="text-gray-300 mb-4 flex justify-center">{icon}</div>
      <p className="text-gray-500 font-medium">{message}</p>
    </div>
  );
}
