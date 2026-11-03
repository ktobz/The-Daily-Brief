<?php

namespace App\Filament\Widgets;

use App\Models\Article;
use App\Models\Comment;
use App\Models\Subscriber;
use App\Models\Subscription;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Published articles', Article::where('status', 'published')->count())
                ->description('Total in archive')
                ->icon('heroicon-o-newspaper'),
            Stat::make('Registered readers', User::where('role', 'reader')->count())
                ->description('Across all editions')
                ->icon('heroicon-o-users'),
            Stat::make('Active subscriptions', Subscription::where('status', 'active')->count())
                ->description('Paying members')
                ->color('success')
                ->icon('heroicon-o-credit-card'),
            Stat::make('Newsletter subscribers', Subscriber::where('is_active', true)->count())
                ->description('Evening Brief')
                ->icon('heroicon-o-envelope'),
        ];
    }
}
