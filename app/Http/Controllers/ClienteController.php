<?php

namespace App\Http\Controllers;

use App\Models\cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
   public function index(Request $request)
{
    $search = $request->query('search');
    $dateStart = $request->query('date_start');
    $dateEnd = $request->query('date_end');
    $sortField = $request->query('field', 'created_at');
    $sortDirection = $request->query('direction', 'desc');

    $clientes = cliente::query()
        ->when($search, function ($query, $search) {
            $query->where('nome', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('aquisicao', 'like', "%{$search}%")
                  ->orWhere('financiadora', 'like', "%{$search}%")
                  ->orWhere('observacao', 'like', "%{$search}%")
                  ->orWhere('comissao', 'like', "%{$search}%");
        })
        ->when($dateStart && $dateEnd, function ($query) use ($dateStart, $dateEnd) {
            $query->whereBetween('created_at', [$dateStart . ' 00:00:00', $dateEnd . ' 23:59:59']);
        })
        ->orderBy($sortField, $sortDirection)
        ->get();

    return inertia('dashboard', [
        'clientes' => $clientes,
        'filters' => $request->only(['search', 'field', 'direction', 'date_start', 'date_end'])
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('cliente/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:clientes',
            'aquisicao' => 'required|string|max:255',
            'financiadora' => 'required|string|max:255',
            'comissao' => 'required|integer|min:0',
            'observacao' => 'nullable|string|max:1000',
        ]);

        cliente::create($validatedData);

        return redirect()->route('dashboard')->with('success', 'Cliente criado com sucesso!');
    }

    /**
     * Display the specified resource.
     */
    public function show(cliente $cliente)
    {
        return inertia('cliente/show', ['cliente' => $cliente]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(cliente $cliente)
    {
        return inertia('cliente/edit', ['cliente' => $cliente]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, cliente $cliente)
    {
        $validatedData = $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:clientes,email,' . $cliente->id,
            'aquisicao' => 'required|string|max:255',
            'financiadora' => 'required|string|max:255',
            'comissao' => 'required|integer|min:0',
            'observacao' => 'nullable|string|max:1000',
        ]);

        $cliente->update($validatedData);

        return redirect()->route('dashboard')->with('success', 'Cliente atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(cliente $cliente)
    {
        $cliente->delete();

        return redirect()->route('dashboard')->with('success', 'Cliente deletado com sucesso!');
    }
}
