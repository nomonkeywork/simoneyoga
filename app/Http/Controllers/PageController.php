<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PageController extends Controller
{
    public function home()
    {
        return view('pages.home');
    }

    public function faq()
    {
        return view('pages.faq');
    }

    public function contact()
    {
        return view('pages.contact');
    }

    public function confidentialite()
    {
        return view('pages.confidentialite');
    }

    public function mentionsLegales()
    {
        return view('pages.mentions-legales');
    }
}

