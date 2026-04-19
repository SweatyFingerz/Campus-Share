import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  BookOpen,
  Search,
  Users,
  ArrowRight,
  Shield,
  Zap,
  Heart,
} from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <BookOpen size={24} />,
      title: "Item Library",
      description:
        "Browse and borrow tools, textbooks, and equipment from fellow students. No cost, just community trust.",
      color: "from-indigo-500 to-blue-500",
      shadow: "shadow-indigo-500/20",
    },
    {
      icon: <Search size={24} />,
      title: "Lost & Found",
      description:
        "Post about lost items or report something you've found. Help reunite students with their belongings.",
      color: "from-purple-500 to-pink-500",
      shadow: "shadow-purple-500/20",
    },
    {
      icon: <Users size={24} />,
      title: "Peer-to-Peer",
      description:
        "Direct handoffs between students. Track who has what, request items, and manage your lending history.",
      color: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/20",
    },
  ];

  const stats = [
    { icon: <Shield size={20} />, label: "Secure Auth", desc: "Firebase-powered" },
    { icon: <Zap size={20} />, label: "Real-time", desc: "Instant updates" },
    { icon: <Heart size={20} />, label: "Community", desc: "Built for students" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-pink-200/20 to-indigo-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-sm font-medium text-indigo-600 mb-8">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Built for University Students
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight mb-6">
              Share More,{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Waste Less
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              CampusShare is your campus peer-to-peer library and lost & found hub.
              Borrow tools, share resources, and help fellow students — all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={isAuthenticated ? "/library" : "/auth"}
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.03] transition-all duration-300 text-lg"
              >
                Get Started
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                to="/library"
                className="flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 text-lg"
              >
                Browse Library
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-8 z-10 max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 grid grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{stat.label}</p>
                <p className="text-xs text-gray-400">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Everything Your Campus Needs
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            A complete platform to share resources and keep your campus connected.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group p-8 bg-white rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 shadow-lg ${feature.shadow} group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <BookOpen size={16} className="text-white" />
              </div>
              <span className="font-bold text-gray-900">CampusShare</span>
            </div>
            <p className="text-sm text-gray-400">
              © 2026 CampusShare. Built for students, by students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
