<?php
session_start();

$test = $_GET['uri_test'] ?? null;

$rutaActual = $test ?? trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

$rutasPublicas = [
    'inicio',
    'login',
    'noAutorizado',
    'saveMenus',
    'index',
    'registro',
    'Dashboard',
    'configuracionInicial',
    'chatInterno',
    'consultas-especialidad',
    'consultas',
    ''
];

if (in_array($rutaActual, $rutasPublicas)) return true;

$menus = $_SESSION['menus'] ?? [];

$permitidas = array_map(fn($r) => strtolower($r), $menus);

if (!in_array(strtolower($rutaActual), $permitidas)) {
    header('Location: /noAutorizado');
    exit;
}

return true;
