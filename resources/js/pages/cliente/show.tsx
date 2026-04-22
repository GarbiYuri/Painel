import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { ArrowLeft, Calendar, Mail, Percent, Building2, ShoppingBag } from 'lucide-react';
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
}

export default function Show({ cliente }: { cliente: Cliente }) {
    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <Head title={`Detalhes - ${cliente.nome}`} />
            
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-2xl font-bold">Detalhes do Cliente</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-sidebar p-6 rounded-xl border border-sidebar-border space-y-4 shadow-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm font-medium">E-mail</span>
                    </div>
                    <p className="text-lg">{cliente.email}</p>

                    <div className="flex items-center gap-3 text-muted-foreground pt-2">
                        <ShoppingBag className="w-4 h-4" />
                        <span className="text-sm font-medium">Bem Adquirido</span>
                    </div>
                    <p className="text-lg">{cliente.aquisicao}</p>

                    <div className="flex items-center gap-3 text-muted-foreground pt-2">
                        <Building2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Financiadora</span>
                    </div>
                    <p className="text-lg">{cliente.financiadora}</p>
                </div>

                <div className="bg-sidebar p-6 rounded-xl border border-sidebar-border space-y-4 shadow-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <Percent className="w-4 h-4" />
                        <span className="text-sm font-medium">Comissão</span>
                    </div>
                    <p className="text-lg text-emerald-500 font-bold">{cliente.comissao}%</p>

                    <div className="flex items-center gap-3 text-muted-foreground pt-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">Data de Cadastro</span>
                    </div>
                    <p className="text-lg">{new Date(cliente.created_at).toLocaleDateString('pt-BR')}</p>
                </div>

                <div className="bg-sidebar p-6 rounded-xl border border-sidebar-border space-y-4 shadow-sm md:col-span-2">
                    <h3 className="font-semibold text-muted-foreground">Observações</h3>
                    <div className="p-4 bg-sidebar-accent/20 rounded-lg min-h-[100px] whitespace-pre-wrap">
                        {cliente.observacao || "Nenhuma observação registrada."}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => router.get(clientesRoutes.edit({ cliente: cliente.id }).url)}>
                    Editar Dados
                </Button>
            </div>
        </div>
    );
}

Show.layout = (page: React.ReactNode) => (
    <AppLayout children={page} breadcrumbs={[{ title: 'Dashboard', href: dashboard() }, { title: 'Detalhes', href: '#' }]} />
);