<?php
session_start();

// Recibimos los menús enviados desde JS
$body = file_get_contents('php://input');
$data = json_decode($body, true);

if (isset($data['menus'])) {
    $_SESSION['menus'] = $data['menus'];
}

http_response_code(200);

header('Content-Type: application/json');

echo json_encode(['ok' => true]);
