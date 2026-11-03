<?php

return [
    'base_url' => env('FLW_BASE_URL', 'https://api.flutterwave.com/v3'),
    'public_key' => env('FLW_PUBLIC_KEY'),
    'secret_key' => env('FLW_SECRET_KEY'),
    'encryption_key' => env('FLW_ENCRYPTION_KEY'),
    'secret_hash' => env('FLW_SECRET_HASH'),
];
