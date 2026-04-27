import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Wallet as WalletIcon,
    ArrowUpCircle,
    ArrowDownCircle,
    Plus,
    CreditCard,
    Banknote,
    WalletCards,
    Calendar,
    ArrowRight,
    MoreVertical,
    Pencil,
    Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { dashboard as dashboardRoute } from '@/routes';
import {
    store,
    update,
    destroy as destroyTransactionRoute,
} from '@/routes/transactions';
import type {
    Wallet,
    Transaction,
    DashboardSummary,
    Category,
} from '@/types/models';

interface DashboardProps {
    summary: DashboardSummary;
    wallets: Wallet[];
    categories: Category[];
    transactions: Transaction[];
}

export default function Dashboard({
    summary,
    wallets,
    categories,
    transactions,
}: DashboardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] =
        useState<Transaction | null>(null);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        wallet_id: '',
        category_id: '',
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0],
    });

    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(amount));
    };

    const getWalletIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'bank':
                return <CreditCard className="size-4" />;
            case 'cash':
                return <Banknote className="size-4" />;
            default:
                return <WalletCards className="size-4" />;
        }
    };

    const openCreateDialog = () => {
        setEditingTransaction(null);
        reset();
        if (wallets.length > 0) setData('wallet_id', wallets[0].id.toString());
        if (categories.length > 0)
            setData('category_id', categories[0].id.toString());
        clearErrors();
        setIsDialogOpen(true);
    };

    const openEditDialog = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setData({
            wallet_id: transaction.wallet_id.toString(),
            category_id: transaction.category_id.toString(),
            amount: Number(transaction.amount),
            description: transaction.description || '',
            date: transaction.date,
        });
        clearErrors();
        setIsDialogOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTransaction) {
            put(update.url(editingTransaction.id), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        } else {
            post(store.url(), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const deleteTransaction = (id: number) => {
        if (
            confirm(
                'Are you sure you want to delete this transaction? The wallet balance will be adjusted.',
            )
        ) {
            destroy(destroyTransactionRoute.url(id));
        }
    };

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                            Financial Dashboard
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400">
                            Welcome back! Here's what's happening with your
                            money.
                        </p>
                    </div>
                    <Button
                        onClick={openCreateDialog}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <Plus className="mr-2 size-4" />
                        Add Transaction
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="border-blue-100 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-500">
                                Total Balance
                            </CardTitle>
                            <WalletIcon className="size-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                                {formatCurrency(summary.total_balance)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-green-100 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-500">
                                This Month's Income
                            </CardTitle>
                            <ArrowUpCircle className="size-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(summary.this_month_income)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-red-100 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-500">
                                This Month's Expense
                            </CardTitle>
                            <ArrowDownCircle className="size-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {formatCurrency(summary.this_month_expense)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card className="h-full dark:border-neutral-800 dark:bg-neutral-900">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-semibold">
                                    Recent Transactions
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    View All{' '}
                                    <ArrowRight className="ml-1 size-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {transactions.length === 0 ? (
                                        <div className="flex h-40 flex-col items-center justify-center text-neutral-500">
                                            <Calendar className="mb-2 size-8 opacity-20" />
                                            <p>No transactions found</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="border-b text-xs text-neutral-500 uppercase dark:border-neutral-800">
                                                    <tr>
                                                        <th className="pr-4 pb-3 font-semibold">
                                                            Date
                                                        </th>
                                                        <th className="pr-4 pb-3 font-semibold">
                                                            Description
                                                        </th>
                                                        <th className="pr-4 pb-3 text-center font-semibold">
                                                            Category
                                                        </th>
                                                        <th className="pr-4 pb-3 font-semibold">
                                                            Wallet
                                                        </th>
                                                        <th className="pb-3 text-right font-semibold">
                                                            Amount
                                                        </th>
                                                        <th className="pb-3 text-right font-semibold"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y dark:divide-neutral-800">
                                                    {transactions.map(
                                                        (transaction) => (
                                                            <tr
                                                                key={
                                                                    transaction.id
                                                                }
                                                                className="group"
                                                            >
                                                                <td className="py-4 pr-4 text-sm text-neutral-600 dark:text-neutral-400">
                                                                    {new Date(
                                                                        transaction.date,
                                                                    ).toLocaleDateString(
                                                                        'id-ID',
                                                                        {
                                                                            day: '2-digit',
                                                                            month: 'short',
                                                                        },
                                                                    )}
                                                                </td>
                                                                <td className="py-4 pr-4">
                                                                    <div className="font-medium text-neutral-900 dark:text-neutral-100">
                                                                        {transaction.description ||
                                                                            'No description'}
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 pr-4 text-center">
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="font-normal"
                                                                        style={{
                                                                            backgroundColor:
                                                                                transaction
                                                                                    .category
                                                                                    ?.color
                                                                                    ? `${transaction.category.color}15`
                                                                                    : undefined,
                                                                            color:
                                                                                transaction
                                                                                    .category
                                                                                    ?.color ||
                                                                                undefined,
                                                                        }}
                                                                    >
                                                                        {transaction
                                                                            .category
                                                                            ?.name ||
                                                                            'Uncategorized'}
                                                                    </Badge>
                                                                </td>
                                                                <td className="py-4 pr-4">
                                                                    <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                                                                        {getWalletIcon(
                                                                            transaction
                                                                                .wallet
                                                                                ?.type ||
                                                                                'cash',
                                                                        )}
                                                                        <span className="ml-2">
                                                                            {
                                                                                transaction
                                                                                    .wallet
                                                                                    ?.name
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td
                                                                    className={`py-4 text-right font-semibold ${Number(transaction.amount) > 0 ? 'text-green-600' : 'text-neutral-900 dark:text-neutral-100'}`}
                                                                >
                                                                    {Number(
                                                                        transaction.amount,
                                                                    ) > 0
                                                                        ? '+'
                                                                        : ''}
                                                                    {formatCurrency(
                                                                        transaction.amount,
                                                                    )}
                                                                </td>
                                                                <td className="py-4 text-right">
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger
                                                                            asChild
                                                                        >
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="size-8"
                                                                            >
                                                                                <MoreVertical className="size-4" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end">
                                                                            <DropdownMenuItem
                                                                                onClick={() =>
                                                                                    openEditDialog(
                                                                                        transaction,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Pencil className="mr-2 size-4" />{' '}
                                                                                Edit
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem
                                                                                className="text-red-600 focus:text-red-600"
                                                                                onClick={() =>
                                                                                    deleteTransaction(
                                                                                        transaction.id,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Trash2 className="mr-2 size-4" />{' '}
                                                                                Delete
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <Card className="h-full dark:border-neutral-800 dark:bg-neutral-900">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">
                                    My Wallets
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {wallets.length === 0 ? (
                                        <div className="flex h-40 flex-col items-center justify-center text-neutral-500">
                                            <WalletIcon className="mb-2 size-8 opacity-20" />
                                            <p>No wallets found</p>
                                        </div>
                                    ) : (
                                        wallets.map((wallet) => (
                                            <div
                                                key={wallet.id}
                                                className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                                        {getWalletIcon(
                                                            wallet.type,
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium">
                                                            {wallet.name}
                                                        </div>
                                                        <div className="text-xs text-neutral-500 uppercase">
                                                            {wallet.type}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                                    {formatCurrency(
                                                        wallet.balance,
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <Button
                                        variant="outline"
                                        className="mt-2 w-full border-dashed border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-neutral-700 dark:text-blue-400 dark:hover:bg-neutral-800"
                                    >
                                        <Plus className="mr-2 size-4" />
                                        Add New Wallet
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingTransaction
                                ? 'Edit Transaction'
                                : 'Add New Transaction'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="wallet_id">Wallet</Label>
                            <Select
                                value={data.wallet_id}
                                onValueChange={(value) =>
                                    setData('wallet_id', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select wallet" />
                                </SelectTrigger>
                                <SelectContent>
                                    {wallets.map((wallet) => (
                                        <SelectItem
                                            key={wallet.id}
                                            value={wallet.id.toString()}
                                        >
                                            {wallet.name} (
                                            {formatCurrency(wallet.balance)})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.wallet_id && (
                                <p className="text-xs text-red-500">
                                    {errors.wallet_id}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category_id">Category</Label>
                            <Select
                                value={data.category_id}
                                onValueChange={(value) =>
                                    setData('category_id', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id.toString()}
                                        >
                                            {category.name} ({category.type})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category_id && (
                                <p className="text-xs text-red-500">
                                    {errors.category_id}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <div className="relative">
                                <Input
                                    id="amount"
                                    type="number"
                                    value={data.amount}
                                    onChange={(e) =>
                                        setData(
                                            'amount',
                                            parseFloat(e.target.value),
                                        )
                                    }
                                    placeholder="Enter amount"
                                />
                            </div>
                            {errors.amount && (
                                <p className="text-xs text-red-500">
                                    {errors.amount}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="e.g. Lunch at Warung"
                            />
                            {errors.description && (
                                <p className="text-xs text-red-500">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={data.date}
                                onChange={(e) =>
                                    setData('date', e.target.value)
                                }
                            />
                            {errors.date && (
                                <p className="text-xs text-red-500">
                                    {errors.date}
                                </p>
                            )}
                        </div>

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-600 text-white hover:bg-blue-700"
                                disabled={processing}
                            >
                                {processing
                                    ? 'Saving...'
                                    : editingTransaction
                                      ? 'Update'
                                      : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboardRoute(),
        },
    ],
};
