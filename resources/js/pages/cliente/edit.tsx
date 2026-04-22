import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';

// IMPORTANTE: Importamos as rotas geradas pelo Wayfinder
import * as clientesRoutes from '@/routes/clientes';

// Definimos a interface do Cliente (deve bater com a do seu Dashboard)
interface Cliente {
    id: number;
    nome: string;
    email: string;
    aquisicao: string;
    financiadora: string;
    comissao: number;
    observacao: string;
    // ... outros campos se houver (created_at, etc)
}

// O Inertia injeta o objeto 'cliente' que enviamos do ClienteController@edit
export default function Edit({ cliente }: { cliente: Cliente }) {
    
    // Inicializamos o formulário useForm COM os dados do cliente existente
    const { data, setData, put, processing, errors } = useForm({
        nome: cliente.nome || '',
        email: cliente.email || '',
        aquisicao: cliente.aquisicao || '',
        financiadora: cliente.financiadora || '',
        // Garantindo que comissão seja número
        comissao: Number(cliente.comissao) || 0, 
        observacao: cliente.observacao || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // No Wayfinder, passamos o parâmetro para a rota 'update'
        const routeDef = clientesRoutes.update({ cliente: cliente.id });
        
        // Enviando os dados via PUT para atualização
        put(routeDef.url);
    };

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <Head title={`Editar Cliente - ${cliente.nome}`} />
            
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">Editar Cliente</h1>
                <p className="text-sm text-muted-foreground">Atualize as informações do cliente abaixo.</p>
            </div>

            <form onSubmit={submit} className="bg-sidebar p-6 rounded-xl border border-sidebar-border space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo</Label>
                        <Input 
                            id="nome" 
                            value={data.nome} 
                            onChange={e => setData('nome', e.target.value)} 
                        />
                        {errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input 
                            id="email" 
                            type="email"
                            value={data.email} 
                            onChange={e => setData('email', e.target.value)} 
                        />
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="aquisicao">Aquisição</Label>
                        <Input 
                            id="aquisicao" 
                            value={data.aquisicao} 
                            onChange={e => setData('aquisicao', e.target.value)} 
                        />
                        {errors.aquisicao && <p className="text-xs text-destructive">{errors.aquisicao}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="financiadora">Financiadora</Label>
                        <Input 
                            id="financiadora" 
                            value={data.financiadora} 
                            onChange={e => setData('financiadora', e.target.value)} 
                        />
                        {errors.financiadora && <p className="text-xs text-destructive">{errors.financiadora}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comissao">Comissão (%)</Label>
                        <Input 
                            id="comissao" 
                            type="number"
                            value={data.comissao} 
                            // Convertemos o valor do input para número
                            onChange={e => setData('comissao', parseInt(e.target.value, 10))} 
                        />
                        {errors.comissao && <p className="text-xs text-destructive">{errors.comissao}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="observacao">Observação</Label>
                    <textarea 
                        id="observacao" 
                        value={data.observacao} 
                        onChange={e => setData('observacao', e.target.value)} 
                        className="min-h-[100px]"
                    />
                    {errors.observacao && <p className="text-xs text-destructive">{errors.observacao}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-sidebar-border">
                    <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => window.history.back()}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Salvando...' : 'Atualizar Cliente'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

// Vinculando ao Layout principal com Breadcrumbs tipados
Edit.layout = (page: React.ReactNode) => (
    <AppLayout 
        children={page} 
        breadcrumbs={[
            { title: 'Dashboard', href: dashboard() },
            { title: 'Editar Cliente', href: '#' }
        ]} 
    />
);