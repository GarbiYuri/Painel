import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';
import { Pencil, Trash2, Eye, ArrowUpDown, Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

// Importando suas rotas Wayfinder
import * as clientesRoutes from '@/routes/clientes'; 

interface Cliente {
    id: number;
    nome: string;
    email: string;
    aquisicao: string;
    financiadora: string;
    comissao: number;
    observacao: string;
    created_at: string;
    updated_at: string;
}

interface Filters {
    search?: string;
    field?: string;
    direction?: 'asc' | 'desc';
    date_start?: string;
    date_end?: string;
}

export default function Dashboard() {
    const { clientes = [], filters } = usePage<{ 
        clientes: Cliente[],
        filters: Filters 
    }>().props;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // --- Helpers de Filtro e Sort ---

    const updateFilters = (newFilters: Partial<Filters>) => {
        const routeDef = clientesRoutes.index({
            query: { ...filters, ...newFilters }
        });
        router.get(routeDef.url, {}, { preserveState: true });
    };

    const handleSort = (field: string) => {
        const direction = filters.field === field && filters.direction === 'asc' ? 'desc' : 'asc';
        updateFilters({ field, direction });
    };

    const handleDateChange = (start: string | undefined, end: string | undefined) => {
        updateFilters({ date_start: start, date_end: end });
    };

    const clearDateFilter = () => {
        updateFilters({ date_start: undefined, date_end: undefined });
    };

    // Pesquisa com Debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                updateFilters({ search: searchTerm });
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const deleteCliente = (id: number) => {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            const routeDef = clientesRoutes.destroy({ cliente: id });
            router.delete(routeDef.url);
        }
    };

    // --- Sub-componente de Cabeçalho Ordenável ---
    const SortableTh = ({ field, label }: { field: string, label: string }) => (
        <th className="p-4 border-b border-sidebar-border font-semibold">
            <button 
                onClick={() => handleSort(field)}
                className="flex items-center gap-1 hover:text-primary transition-colors uppercase text-[10px] tracking-wider"
            >
                {label}
                <ArrowUpDown className={`w-3 h-3 ${filters.field === field ? 'opacity-100 text-primary' : 'opacity-30'}`} />
            </button>
        </th>
    );

    return (
        <>
            <Head title="Dashboard" />
            
            <div className="p-6 space-y-6">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                

                    <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                        <Button className="h-10 px-6" onClick={() => router.get(clientesRoutes.create().url)}>
                            Novo Cliente
                        </Button>
                        

                        {/* Barra de Busca */}
                        <div className="relative flex-1 md:flex-none md:w-64">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar cliente..."
                                className="pl-9 h-10 shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {/* Filtro de Período (Calendário) */}
                        <div className="flex items-center gap-2 bg-sidebar border border-sidebar-border p-1.5 rounded-lg shadow-sm">
                            <Input
                                type="date"
                                className="h-8 w-36 border-none bg-transparent text-[12px] focus-visible:ring-0"
                                value={filters.date_start || ''}
                                onChange={(e) => handleDateChange(e.target.value, filters.date_end)}
                            />
                            <span className="text-xs font-medium text-muted-foreground">até</span>
                            <Input
                                type="date"
                                className="h-8 w-36 border-none bg-transparent text-[12px] focus-visible:ring-0"
                                value={filters.date_end || ''}
                                onChange={(e) => handleDateChange(filters.date_start, e.target.value)}
                            />
                            {(filters.date_start || filters.date_end) && (
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 text-destructive hover:bg-destructive/10" 
                                    onClick={clearDateFilter}
                                >
                                    <X className="w-3.5 h-3.5" />
                                </Button>
                            )}
                        </div>
                        
                    </div>
                </div>

                {/* Tabela de Dados */}
                <div className="bg-sidebar rounded-xl border border-sidebar-border overflow-hidden shadow-md">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-sidebar-accent/50">
                            <tr>
                                <th className="p-4 border-b border-sidebar-border font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Ações</th>
                                <SortableTh field="nome" label="Nome" />
                                <SortableTh field="email" label="E-mail" />
                                <SortableTh field="aquisicao" label="Aquisição" />
                                <SortableTh field="financiadora" label="Financiadora" />
                                <SortableTh field="comissao" label="Comissão" />
                                <SortableTh field="created_at" label="Data" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border">
                            {clientes.length > 0 ? (
                                clientes.map((cliente) => (
                                    <tr key={cliente.id} className="hover:bg-sidebar-accent/20 transition-colors group">
                                        <td className="p-4 space-x-1 flex items-center">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-emerald-500 hover:bg-emerald-500/10" 
                                                onClick={() => router.get(clientesRoutes.show({ cliente: cliente.id }).url)}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-blue-500 hover:bg-blue-500/10" 
                                                onClick={() => router.get(clientesRoutes.edit({ cliente: cliente.id }).url)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-red-500 hover:bg-red-500/10" 
                                                onClick={() => deleteCliente(cliente.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                        <td className="p-4 font-medium">{cliente.nome}</td>
                                        <td className="p-4 text-muted-foreground">{cliente.email}</td>
                                        <td className="p-4">{cliente.aquisicao}</td>
                                        <td className="p-4">{cliente.financiadora}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-sidebar-accent/30 rounded font-mono text-xs">
                                                {cliente.comissao}%
                                            </span>
                                        </td>
                                        <td className="p-4 text-[12px] text-muted-foreground">
                                            {new Date(cliente.created_at).toLocaleDateString('pt-BR')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-20 text-center text-muted-foreground italic">
                                        Nenhum cliente encontrado com estes filtros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <AppLayout children={page} breadcrumbs={[{ title: 'Dashboard', href: dashboard() }]} />
);