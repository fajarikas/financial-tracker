import { TrendingUp } from 'lucide-react';

export default function AppLogo() {
    return (
        <a className="flex items-center justify-center space-x-3" href="/">
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-blue-600 text-white">
                <TrendingUp className="size-5" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold">
                    Financial Tracker
                </span>
            </div>
        </a>
    );
}
