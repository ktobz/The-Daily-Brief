<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>The Daily Brief</title>
</head>
<body style="margin:0;padding:0;background:#fbf9f6;color:#1a1a1a;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:640px;margin:0 auto;padding:32px 24px;">
        <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:4px;color:#b91c1c;">THE DAILY BRIEF</p>
        {!! $body !!}
        <p style="margin-top:32px;font-size:12px;line-height:1.6;color:#6b6560;font-family:Arial,sans-serif;">
            You received this email because you subscribed at The Daily Brief.
            <a href="{{ $unsubscribeUrl }}" style="color:#b91c1c;">Unsubscribe</a>.
        </p>
    </div>
</body>
</html>
