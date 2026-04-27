import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { store, update, destroy as destroyCategoryRoute, index as categoriesRoute } from '@/routes/categories';
import type { Category } from '@/types/models';

interface CategoriesProps {
    categories: Category[];
}

export default function Categories({ categories }: CategoriesProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        type: 'expense' as 'income' | 'expense',
        color: '#3b82f6',
        icon: 'tag',
    });

    const openCreateDialog = () => {
        setEditingCategory(null);
        reset();
        clearErrors();
        setIsDialogOpen(true);
    };

    const openEditDialog = (category: Category) => {
        setEditingCategory(category);
        setData({
            name: category.name,
            type: category.type,
            color: category.color || '#3b82f6',
            icon: category.icon || 'tag',
        });
        clearErrors();
        setIsDialogOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            put(update.url(editingCategory.id), {
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

    const deleteCategory = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            destroy(destroyCategoryRoute.url(id));
        }
    };

    return (
        <>
            <Head title="Categories" />
            
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Categories</h1>
                        <p className="text-neutral-500 dark:text-neutral-400">Manage your income and expense categories.</p>
                    </div>
                    <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-2 size-4" />
                        Add Category
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {categories.map((category) => (
                        <Card key={category.id} className="overflow-hidden border-neutral-200 dark:border-neutral-800">
                            <CardContent className="p-0">
                                <div 
                                    className="h-2 w-full" 
                                    style={{ backgroundColor: category.color || '#3b82f6' }}
                                />
                                <div className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-3">
                                        <div 
                                            className="flex size-10 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800"
                                            style={{ color: category.color || '#3b82f6' }}
                                        >
                                            <Tag className="size-5" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-neutral-900 dark:text-neutral-100">{category.name}</div>
                                            <Badge variant="outline" className="mt-1 capitalize">
                                                {category.type}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="size-8 text-neutral-500 hover:text-blue-600"
                                            onClick={() => openEditDialog(category)}
                                        >
                                            <Pencil className="size-4" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="size-8 text-neutral-500 hover:text-red-600"
                                            onClick={() => deleteCategory(category.id)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {categories.length === 0 && (
                        <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 text-neutral-500 dark:border-neutral-800">
                            <Tag className="mb-2 size-8 opacity-20" />
                            <p>No categories found. Create your first one!</p>
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input 
                                id="name" 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)}
                                placeholder="e.g. Food, Salary, Rent"
                            />
                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select 
                                value={data.type} 
                                onValueChange={(value: 'income' | 'expense') => setData('type', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="income">Income</SelectItem>
                                    <SelectItem value="expense">Expense</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && <p className="text-xs text-red-500">{errors.type}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="color">Color</Label>
                            <div className="flex items-center gap-3">
                                <Input 
                                    id="color" 
                                    type="color"
                                    value={data.color} 
                                    onChange={e => setData('color', e.target.value)}
                                    className="h-10 w-20 p-1"
                                />
                                <span className="text-sm font-mono text-neutral-500">{data.color}</span>
                            </div>
                            {errors.color && <p className="text-xs text-red-500">{errors.color}</p>}
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
                                {processing ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

Categories.layout = {
    breadcrumbs: [
        {
            title: 'Categories',
            href: categoriesRoute(),
        },
    ],
};
