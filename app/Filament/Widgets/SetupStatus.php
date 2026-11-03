<?php

namespace App\Filament\Widgets;

use App\Services\FirebaseService;
use Filament\Widgets\Widget;

class SetupStatus extends Widget
{
    protected string $view = 'filament.widgets.setup-status';

    protected int|string|array $columnSpan = 'full';

    public function getViewData(): array
    {
        return [
            'flutterwave' => (bool) config('flutterwave.secret_key'),
            'firebaseServer' => app(FirebaseService::class)->isConfigured(),
            'firebaseWeb' => (bool) config('firebase.api_key'),
        ];
    }
}
