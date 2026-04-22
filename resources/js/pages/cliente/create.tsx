import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { dashboard } from '@/routes';

// Importando as rotas geradas pelo Wayfinder
import * as clientesRoutes from '@/routes/clientes';

export default function Create() {
    // Inicializando o formulário com useForm
    const { data, setData, post, processing, errors } = useForm({
        nome: '',
        email: '',
        aquisicao: '',
        financiadora: '',
        comissao: 0,
        observacao: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Usando o Wayfinder para pegar a URL e o método da rota 'store'
        const routeDef = clientesRoutes.store();
        
        // Enviando os dados via POST
        post(routeDef.url);
    };

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <Head title="Cadastrar Cliente" />
            
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">Novo Cliente</h1>
                <p className="text-sm text-muted-foreground">Preencha os dados abaixo para cadastrar um novo cliente no sistema.</p>
            </div>

            <form onSubmit={submit} className="bg-sidebar p-6 rounded-xl border border-sidebar-border space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo</Label>
                        <Input 
                            id="nome" 
                            value={data.nome} 
                            onChange={e => setData('nome', e.target.value)} 
                            placeholder="Ex: João Silva"
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
                            placeholder="joao@email.com"
                        />
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="aquisicao">Aquisição</Label>
                        <Input 
                            id="aquisicao" 
                            value={data.aquisicao} 
                            onChange={e => setData('aquisicao', e.target.value)} 
                            placeholder="Ex: Veículo"
                        />
                        {errors.aquisicao && <p className="text-xs text-destructive">{errors.aquisicao}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="financiadora">Financiadora</Label>
                        <Input 
                            id="financiadora" 
                            value={data.financiadora} 
                            onChange={e => setData('financiadora', e.target.value)} 
                            placeholder="Ex: Banco X"
                        />
                        {errors.financiadora && <p className="text-xs text-destructive">{errors.financiadora}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comissao">Comissão (%)</Label>
                        <Input 
                            id="comissao" 
                            type="number"
                            value={data.comissao} 
                            onChange={e => setData('comissao', parseInt(e.target.value))} 
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
                        placeholder="Informações adicionais..."
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
                        {processing ? 'Salvando...' : 'Salvar Cliente'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

// Vinculando ao Layout principal
Create.layout = (page: React.ReactNode) => (
    <AppLayout 
        children={page} 
        breadcrumbs={[
            { title: 'Dashboard', href: dashboard() },
            { title: 'Novo Cliente', href: '#' }
        ]} 
    />
);