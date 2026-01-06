<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>@yield('title', 'simoneyoga — Kostenlose Herz-Kohärenz')</title>
    <meta name="description" content="@yield('description', 'Reduziere deinen Stress in 5 Min mit simoneyoga, der kostenlosen Herz-Kohärenz-App, ohne Werbung oder In-App-Käufe.')">
    
    @yield('meta')
    
    <link rel="icon" href="{{ asset('images/favicon.ico') }}" sizes="any">
    <link href="{{ asset('css/styles.css') }}" rel="stylesheet">
    <link href="{{ asset('css/philosophy-mobile.css') }}" rel="stylesheet">
    <link href="{{ asset('css/responsive.css') }}" rel="stylesheet">
    
    @yield('styles')
</head>
<body class="default">
    @yield('content')
    
    @yield('scripts')
</body>
</html>


