<div class="fi-wi-stats-overview">
    <div class="rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 p-6 dark:bg-gray-900">
        <h3 class="text-base font-semibold text-gray-950 dark:text-white">Integration status</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Add keys in <code>.env</code> (backend) and <code>frontend/.env.local</code> (web).</p>

        <dl class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <dt class="text-xs font-semibold uppercase tracking-wide text-gray-500">Flutterwave</dt>
                <dd class="mt-1 text-sm font-medium">
                    @if ($flutterwave)
                        <span class="text-emerald-600">✓ Configured</span>
                    @else
                        <span class="text-red-600">✗ Not configured</span>
                    @endif
                </dd>
                @unless ($flutterwave)
                    <dd class="mt-1 text-xs text-gray-500">Set <code>FLW_SECRET_KEY</code>, <code>FLW_PUBLIC_KEY</code>, <code>FLW_ENCRYPTION_KEY</code>, <code>FLW_SECRET_HASH</code>.</dd>
                @endunless
            </div>

            <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <dt class="text-xs font-semibold uppercase tracking-wide text-gray-500">Firebase (server)</dt>
                <dd class="mt-1 text-sm font-medium">
                    @if ($firebaseServer)
                        <span class="text-emerald-600">✓ Configured</span>
                    @else
                        <span class="text-red-600">✗ Not configured</span>
                    @endif
                </dd>
                @unless ($firebaseServer)
                    <dd class="mt-1 text-xs text-gray-500">Set <code>FIREBASE_CREDENTIALS</code> to a service-account JSON path.</dd>
                @endunless
            </div>

            <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <dt class="text-xs font-semibold uppercase tracking-wide text-gray-500">Firebase (web)</dt>
                <dd class="mt-1 text-sm font-medium">
                    @if ($firebaseWeb)
                        <span class="text-emerald-600">✓ Configured</span>
                    @else
                        <span class="text-red-600">✗ Not configured</span>
                    @endif
                </dd>
                @unless ($firebaseWeb)
                    <dd class="mt-1 text-xs text-gray-500">Set <code>NEXT_PUBLIC_FIREBASE_*</code> in <code>frontend/.env.local</code>.</dd>
                @endunless
            </div>
        </dl>

        <p class="mt-3 text-xs text-gray-400">Run <code>php artisan setup:check</code> for a full report.</p>
    </div>
</div>
