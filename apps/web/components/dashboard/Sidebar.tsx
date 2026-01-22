"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
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
} from 'lucide-react'

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/coming-soon', label: 'Worker Management', icon: Users },
    { href: '/job-templates', label: 'Job Posting Template', icon: FilePlus },
    { href: '/job-listings', label: 'Job Listings', icon: Briefcase },
    { href: '/coming-soon', label: 'Messages', icon: MessageSquare, badge: true },
    { href: '/coming-soon', label: 'Check In/Out Mgmt', icon: Clock },
    { href: '/coming-soon', label: 'Change Requests', icon: GitPullRequest },
    { href: '/coming-soon', label: 'Worker Review', icon: UserCheck },
    { href: '/coming-soon', label: 'Store Review', icon: Star },
    { href: '/coming-soon', label: 'Statement', icon: Receipt },
    { href: '/coming-soon', label: 'Store Information', icon: Building2 },
]

const bottomNavItems = [
    { href: '/coming-soon', label: 'Feedback', icon: Send },
    { href: '/coming-soon', label: 'Q & A', icon: HelpCircle },
]

export function Sidebar() {
    const pathname = usePathname()

    const isActive = (href: string, label: string) => {
        if (href === '/') return pathname === '/'
        if (href === '/coming-soon') return false
        return pathname.startsWith(href)
    }

    return (
        <aside className="w-64 bg-zinc-950 border-r border-zinc-800/60 flex-shrink-0 flex flex-col">
            {/* Logo Section */}
            <div className="h-16 flex items-center px-6 border-b border-zinc-800/50 flex-shrink-0">
                <Link href="/" className="text-lg font-bold tracking-tighter text-zinc-100">SHIFTLY</Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-0.5 scrollbar-hide">

                <div className="px-3 mb-3 mt-1">
                    <h2 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">My Page</h2>
                </div>

                {navItems.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href, item.label)

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${active
                                    ? 'text-zinc-100 bg-zinc-800/80'
                                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                                }`}
                        >
                            <Icon className={`w-4 h-4 stroke-[1.5] transition-colors ${active ? 'text-zinc-100' : 'text-zinc-500 group-hover:text-zinc-300'
                                }`} />
                            {item.label}
                            {item.badge && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                            )}
                        </Link>
                    )
                })}

                <div className="my-3 border-t border-zinc-800/50 mx-3"></div>

                {bottomNavItems.map((item) => {
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="group flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-all duration-200"
                        >
                            <Icon className="w-4 h-4 stroke-[1.5] text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
