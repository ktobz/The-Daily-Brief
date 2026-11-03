{!! '<'.'?xml version="1.0" encoding="UTF-8"?'.'>' !!}
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>Dispatches &amp; Sound — The Daily Brief</title>
        <link>{{ config('app.url') }}</link>
        <atom:link href="{{ url('/api/audio/feed/'.$token) }}" rel="self" type="application/rss+xml" />
        <description>Private podcast feed: broadcast audio intelligence from The Daily Brief.</description>
        <language>en</language>
        <itunes:author>The Daily Brief</itunes:author>
        <itunes:explicit>false</itunes:explicit>
        <itunes:owner>
            <itunes:name>The Daily Brief</itunes:name>
        </itunes:owner>
        @foreach ($broadcasts as $broadcast)
            <item>
                <title>{{ $broadcast->title }}</title>
                <link>{{ config('app.url') }}</link>
                <guid isPermaLink="false">{{ $broadcast->id }}</guid>
                <description>{{ $broadcast->dek }}</description>
                <pubDate>{{ optional($broadcast->published_at)->toRfc2822String() ?? now()->toRfc2822String() }}</pubDate>
                <itunes:duration>{{ $broadcast->duration_seconds }}</itunes:duration>
                <enclosure url="{{ $streamUrl($broadcast) }}" length="0" type="audio/flac" />
            </item>
        @endforeach
    </channel>
</rss>
