import { Link } from '@inertiajs/react';
import { TrendingUp } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-slate-50 dark:bg-[#09090b] p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link
                    href={home()}
                    className="flex items-center gap-2 self-center font-bold"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-white">
                        <TrendingUp className="size-5" />
                    </div>
                    <span className="text-xl tracking-tight">Financial Tracker</span>
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="rounded-2xl shadow-none border-slate-200 dark:border-slate-800">
                        <CardHeader className="px-10 pt-8 pb-0 text-center space-y-2">
                            <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 py-8">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
