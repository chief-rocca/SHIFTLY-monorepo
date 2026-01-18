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
} from 'lucide-react';

export function Sidebar() {
    return (
        <aside className="w-64 bg-zinc-950 border-r border-zinc-800/60 flex-shrink-0 flex flex-col">
            {/* Logo Section */}
            <div className="h-16 flex items-center px-6 border-b border-zinc-800/50 flex-shrink-0">
                <span className="text-lg font-bold tracking-tighter text-zinc-100">SHIFTLY</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-0.5 scrollbar-hide">

                <div className="px-3 mb-3 mt-1">
                    <h2 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">My Page</h2>
                </div>

                <a href="#"
                    className="group flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-all duration-200">
                    <MapPin className="w-4 h-4 stroke-[1.5] text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    Location
                </a>

                <a href="#"
                    className="group flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-100 bg-zinc-800/80 rounded-md transition-all duration-200">
                    <Home className="w-4 h-4 stroke-[1.5] text-zinc-100 transition-colors" />
                    Home
                </a>

                <a href="#"
                    className="group flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-all duration-200">
                    <Users className="w-4 h-4 stroke-[1.5] text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    Worker Management
                </a>

                <a href="#"
                    className="group flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-all duration-200">
                    <FilePlus className="w-4 h-4 stroke-[1.5] text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    Job Posting Template
                </a>

                <a href="#"
                    className="group flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-all duration-200">
                    <Briefcase className="w-4 h-4 stroke-[1.5] text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    Job Listings
                </a>

                <a href="#"
                    className="group flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-all duration-200">
                    <MessageSquare className="w-4 h-4 stroke-[1.5] text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    Messages
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                </a>

                <a href="#"
                    className="group flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-all duration-200">
                    <Clock className="w-4 h-4 stroke-[1.5] text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    Check In/Out Mgmt
                </a>

                <a href="#"
                    className="group flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-all duration-200">
                    <GitPullRequest className="w-4 h-4 stroke-[1.5] text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    Change Requests
                </a>

                <a href="#"
                    className="group flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-all duration-200">
                    <UserCheck className="w-4 h-4 stroke-[1.5] text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    Worker Review
                </a>

                <a href="#"
                    className="group flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-all duration-200">
                    <Star className="w-4 h-4 stroke-[1.5] text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    Store Review
                </a>

                <a href="#"
                    className="group flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-all duration-200">
                    <Receipt className="w-4 h-4 stroke-[1.5] text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    Statement
                </a>

                <a href="#"
                    className="group flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-all duration-200">
                    <Building2 className="w-4 h-4 stroke-[1.5] text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    Store Information
                </a>

                <div className="my-3 border-t border-zinc-800/50 mx-3"></div>

                <a href="#"
                    className="group flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-all duration-200">
                    <Send className="w-4 h-4 stroke-[1.5] text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    Feedback
                </a>

                <a href="#"
                    className="group flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-all duration-200">
                    <HelpCircle className="w-4 h-4 stroke-[1.5] text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    Q &amp; A
                </a>
            </nav>
        </aside>
    );
}
