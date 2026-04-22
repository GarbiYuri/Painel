<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class cliente extends Model
{
    protected $fillable = [
        'nome',
        'email',
        'aquisicao',
        'financiadora',
        'comissao',
        'observacao',
    ];
}
