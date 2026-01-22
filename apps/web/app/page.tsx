import {
  MapPin,
  Home,
  Users,
  FilePlus,
  Briefcase,
  MessageSquare,
  Clock,
  GitPullRequest,
  UserCheck,
  Star,
  Receipt,
  Building2,
  Send,
  HelpCircle,
  Bell,
  X,
  ArrowUp,
  UserPlus
} from 'lucide-react';
import Image from 'next/image';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden selection:bg-orange-500/30 text-zinc-100 bg-zinc-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 bg-zinc-900 relative overflow-hidden flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-8 bg-zinc-900/50 backdrop-blur-sm z-10">
          <h1 className="text-sm font-medium text-zinc-200">Home</h1>
          {/* Store ID Label */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-800/50">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-mono text-zinc-400 tracking-tight">STORE ID: <span
              className="text-zinc-200">88-3921</span></span>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-8">

            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-zinc-100">Overview</h2>
                <p className="text-sm text-zinc-500 mt-1">Welcome back, here's what's happening at your store today.
                </p>
              </div>
            </div>

            {/* Notices Section */}
            <div className="relative overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 rounded-full bg-zinc-800/80 p-1.5 text-zinc-400 border border-zinc-700/50">
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-zinc-200">Important System Notice</h3>
                  <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                    Scheduled maintenance for the messaging system will occur on Sunday at 2:00 AM. Please
                    approve all pending worker reviews before this time to ensure accurate payroll
                    processing for the week.
                  </p>
                </div>
                <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions / Card Buttons */}
            <div>
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {/* New Recruitment */}
                <a href="/job-templates"
                  className="flex flex-col gap-2 p-3 rounded-lg border border-zinc-800/60 bg-zinc-800/20 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all group">
                  <UserPlus className="w-5 h-5 text-zinc-500 group-hover:text-orange-500 transition-colors" />
                  <span className="text-xs font-medium text-zinc-300 group-hover:text-zinc-100">New Recruitment</span>
                </a>

                {/* Check In/Out Mgmt */}
                <a href="#"
                  className="flex flex-col gap-2 p-3 rounded-lg border border-zinc-800/60 bg-zinc-800/20 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all group">
                  <Clock className="w-5 h-5 text-zinc-500 group-hover:text-orange-500 transition-colors" />
                  <span className="text-xs font-medium text-zinc-300 group-hover:text-zinc-100">Check In/Out</span>
                </a>

                {/* Change Requests */}
                <a href="#"
                  className="flex flex-col gap-2 p-3 rounded-lg border border-zinc-800/60 bg-zinc-800/20 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all group">
                  <GitPullRequest className="w-5 h-5 text-zinc-500 group-hover:text-orange-500 transition-colors" />
                  <span className="text-xs font-medium text-zinc-300 group-hover:text-zinc-100">Requests</span>
                </a>

                {/* Worker Review */}
                <a href="#"
                  className="flex flex-col gap-2 p-3 rounded-lg border border-zinc-800/60 bg-zinc-800/20 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all group">
                  <UserCheck className="w-5 h-5 text-zinc-500 group-hover:text-orange-500 transition-colors" />
                  <span className="text-xs font-medium text-zinc-300 group-hover:text-zinc-100">Reviews</span>
                </a>

                {/* Messages */}
                <a href="#"
                  className="flex flex-col gap-2 p-3 rounded-lg border border-zinc-800/60 bg-zinc-800/20 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all group">
                  <MessageSquare className="w-5 h-5 text-zinc-500 group-hover:text-orange-500 transition-colors" />
                  <span className="text-xs font-medium text-zinc-300 group-hover:text-zinc-100">Messages</span>
                </a>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-800/60 hover:border-zinc-700 transition-colors group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-zinc-500">Active Workers</span>
                  <Users className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-semibold text-zinc-100 tracking-tight">12</span>
                  <span className="text-xs text-emerald-500 mb-1 flex items-center gap-0.5">
                    <ArrowUp className="w-3 h-3" /> 2
                  </span>
                </div>
              </div>

              <div
                className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-800/60 hover:border-zinc-700 transition-colors group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-zinc-500">New Applications</span>
                  <FilePlus className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-semibold text-zinc-100 tracking-tight">5</span>
                  <span className="text-xs text-zinc-500 mb-1">Today</span>
                </div>
              </div>

              <div
                className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-800/60 hover:border-zinc-700 transition-colors group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-zinc-500">Pending Reviews</span>
                  <Star className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-semibold text-zinc-100 tracking-tight">3</span>
                  <span className="text-xs text-orange-500 mb-1">Action required</span>
                </div>
              </div>
            </div>

            {/* Recent Activity Table Placeholder */}
            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-800/60 bg-zinc-800/20 flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-300">Recent Shifts</h3>
                <button className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">View all</button>
              </div>
              <div className="p-4 text-center text-zinc-500 text-xs py-12">
                <div
                  className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-5 h-5 text-zinc-600" />
                </div>
                No shift activity recorded recently.
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
