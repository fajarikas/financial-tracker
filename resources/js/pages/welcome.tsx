import { Head, Link, usePage } from '@inertiajs/react';
import {
    TrendingUp,
    ArrowRight,
    CreditCard,
    PieChart,
    Check,
} from 'lucide-react';
import { dashboard, login, register } from '@/routes';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 dark:bg-[#09090b] dark:text-slate-200 dark:selection:bg-blue-900/40">
            <Head title="Financial Tracker - Simplify your money" />

            {/* Minimalist Navbar */}
            <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-[#09090b]/80">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded bg-blue-600">
                            <TrendingUp className="size-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">
                            Financial Tracker
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="text-sm font-medium transition-colors hover:text-blue-600"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="text-sm font-medium transition-colors hover:text-blue-600"
                                >
                                    Login
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-all active:scale-95 dark:bg-white dark:text-slate-900"
                                    >
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-6xl px-6">
                {/* Hero Section */}
                <section className="flex flex-col items-center py-20 text-center md:py-32">
                    <h1 className="mb-6 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 md:text-6xl dark:text-white">
                        Managing money shouldn't be a second job.
                    </h1>
                    <p className="mb-10 max-w-2xl text-lg leading-relaxed text-slate-500 dark:text-slate-400">
                        A clean, single-purpose tool to track your wallets,
                        categories, and every single transaction without the
                        clutter.
                    </p>
                    <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                        <Link
                            href={auth.user ? dashboard() : register()}
                            className="flex items-center justify-center gap-2 rounded bg-blue-600 px-8 py-3.5 text-lg font-bold text-white transition-colors hover:bg-blue-700"
                        >
                            Get Started Free
                            <ArrowRight className="size-5" />
                        </Link>
                    </div>
                </section>

                {/* Simplified Feature Preview */}
                <section className="grid grid-cols-1 gap-12 border-t border-slate-100 py-20 md:grid-cols-3 dark:border-slate-800">
                    <div className="space-y-4">
                        <div className="flex size-10 items-center justify-center rounded bg-blue-50 dark:bg-blue-900/20">
                            <CreditCard className="size-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                            Multi-wallet support
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                            BCA, GoPay, Cash, or ShopeePay. Group your money
                            into logical wallets and see your total balance at a
                            glance.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex size-10 items-center justify-center rounded bg-blue-50 dark:bg-blue-900/20">
                            <PieChart className="size-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                            Clean categorization
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                            Organize transactions with simple, user-defined
                            categories. No more "Uncategorized" mess in your
                            history.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex size-10 items-center justify-center rounded bg-blue-50 dark:bg-blue-900/20">
                            <Check className="size-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                            Real-time summaries
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                            Know exactly how much you spent this month versus
                            how much you earned, automatically calculated every
                            day.
                        </p>
                    </div>
                </section>

                {/* Subtle UI Teaser */}
                <section className="py-20">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 md:p-12 dark:border-slate-800 dark:bg-slate-900/50">
                        <div className="mb-10">
                            <h2 className="mb-2 text-2xl font-bold text-slate-950 dark:text-white">
                                Recent activity
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                This is how you will manage your finances —
                                simple, transparent, and in real-time.
                            </p>
                        </div>

                        {/* Mock Table - Very Clean */}
                        <div className="space-y-3">
                            {[
                                {
                                    date: '27 Apr',
                                    desc: 'Lunch at Warung',
                                    cat: 'Food',
                                    amount: -25000,
                                    color: 'text-slate-900 dark:text-white',
                                },
                                {
                                    date: '26 Apr',
                                    desc: 'Freelance Project',
                                    cat: 'Salary',
                                    amount: 5000000,
                                    color: 'text-emerald-600 font-bold',
                                },
                                {
                                    date: '25 Apr',
                                    desc: 'Gasoline',
                                    cat: 'Transport',
                                    amount: -150000,
                                    color: 'text-slate-900 dark:text-white',
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between border-b border-slate-100 py-4 last:border-0 dark:border-slate-800"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="w-12 text-xs font-medium text-slate-400">
                                            {item.date}
                                        </span>
                                        <div>
                                            <div className="text-sm font-semibold">
                                                {item.desc}
                                            </div>
                                            <div className="text-[11px] tracking-wider text-slate-400 uppercase">
                                                {item.cat}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`text-sm ${item.color}`}>
                                        {item.amount > 0 ? '+' : ''}
                                        {new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                            minimumFractionDigits: 0,
                                        }).format(item.amount)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="mx-auto max-w-6xl border-t border-slate-100 px-6 py-12 text-slate-400 dark:border-slate-800">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <p className="text-sm font-medium">
                        © 2026 Financial Tracker
                    </p>
                    <div className="flex gap-10 text-xs font-bold tracking-widest uppercase">
                        <Link
                            href="#"
                            className="transition-colors hover:text-blue-600"
                        >
                            Privacy
                        </Link>
                        <Link
                            href="#"
                            className="transition-colors hover:text-blue-600"
                        >
                            Terms
                        </Link>
                        <a
                            href="https://github.com/fajarikas/financial-tracker"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-blue-600"
                        >
                            Github
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
