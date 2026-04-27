import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Pencil, Trash2, CreditCard, Banknote, WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { store, update, destroy as destroyWalletRoute, index as walletsRoute } from '@/routes/wallets';
import type { Wallet } from '@/types/models';

interface WalletsProps {
    wallets: Wallet[];
}

export default function Wallets({ wallets }: WalletsProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        type: 'bank' as 'bank' | 'cash' | 'wallet',
        balance: 0,
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
            case 'bank': return <CreditCard className="size-6 text-blue-600" />;
            case 'cash': return <Banknote className="size-6 text-green-600" />;
            default: return <WalletCards className="size-6 text-purple-600" />;
        }
    };

    const openCreateDialog = () => {
        setEditingWallet(null);
        reset();
        clearErrors();
        setIsDialogOpen(true);
    };

    const openEditDialog = (wallet: Wallet) => {
        setEditingWallet(wallet);
        setData({
            name: wallet.name,
            type: wallet.type as 'bank' | 'cash' | 'wallet',
            balance: wallet.balance,
        });
        clearErrors();
        setIsDialogOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingWallet) {
            put(update.url(editingWallet.id), {
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

    const deleteWallet = (id: number) => {
        if (confirm('Are you sure you want to delete this wallet? All associated transactions will also be deleted.')) {
            destroy(destroyWalletRoute.url(id));
        }
    };

    return (
        <>
            <Head title="Wallets" />
            
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Wallets</h1>
                        <p className="text-neutral-500 dark:text-neutral-400">Manage your bank accounts and digital wallets.</p>
                    </div>
                    <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-2 size-4" />
                        Add Wallet
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {wallets.map((wallet) => (
                        <Card key={wallet.id} className="relative overflow-hidden border-neutral-200 dark:border-neutral-800">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex size-12 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                                            {getWalletIcon(wallet.type)}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-neutral-900 dark:text-neutral-100">{wallet.name}</div>
                                            <div className="text-xs uppercase text-neutral-500">{wallet.type}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="size-8 text-neutral-500 hover:text-blue-600"
                                            onClick={() => openEditDialog(wallet)}
                                        >
                                            <Pencil className="size-4" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="size-8 text-neutral-500 hover:text-red-600"
                                            onClick={() => deleteWallet(wallet.id)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <div className="text-sm text-neutral-500">Current Balance</div>
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                                        {formatCurrency(wallet.balance)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {wallets.length === 0 && (
                        <div className="col-span-full flex h-48 flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 text-neutral-500 dark:border-neutral-800">
                            <CreditCard className="mb-2 size-8 opacity-20" />
                            <p>No wallets found. Create your first one!</p>
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingWallet ? 'Edit Wallet' : 'Add New Wallet'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Wallet Name</Label>
                            <Input 
                                id="name" 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)}
                                placeholder="e.g. My Savings, GoPay"
                            />
                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select 
                                value={data.type} 
                                onValueChange={(value: 'bank' | 'cash' | 'wallet') => setData('type', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bank">Bank Account</SelectItem>
                                    <SelectItem value="cash">Physical Cash</SelectItem>
                                    <SelectItem value="wallet">Digital Wallet / E-Money</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && <p className="text-xs text-red-500">{errors.type}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="balance">Initial Balance</Label>
                            <Input 
                                id="balance" 
                                type="number"
                                value={data.balance} 
                                onChange={e => setData('balance', parseFloat(e.target.value))}
                            />
                            {errors.balance && <p className="text-xs text-red-500">{errors.balance}</p>}
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
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={processing}
                            >
                                {processing ? 'Saving...' : (editingWallet ? 'Update' : 'Create')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

Wallets.layout = {
    breadcrumbs: [
        {
            title: 'Wallets',
            href: walletsRoute(),
        },
    ],
};
