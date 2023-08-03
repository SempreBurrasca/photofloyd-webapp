<?php
$baseUploadDir = "upload/";

if (!file_exists($baseUploadDir)) {
    mkdir($baseUploadDir, 0755, true);
}

$subfolder = $_GET['subfolder'] ?? null;
$uploadDir = $subfolder ? $baseUploadDir . $subfolder . "/" : $baseUploadDir;

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$response = ['success' => [], 'error' => [], 'photos' => []];

if (isset($_FILES['photo'])) {
    $photo = $_FILES['photo'];
    $targetFile = $uploadDir . basename($photo['name']);

    if (move_uploaded_file($photo['tmp_name'], $targetFile)) {
        $response['success'][] = "La foto {$photo['name']} è stata caricata con successo.";
        $response['photos'][] = [
            'name' => $photo['name'],
            'url' => (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]/app/$targetFile"
        ];
    } else {
        $response['error'][] = "Si è verificato un errore durante il caricamento della foto {$photo['name']}.";
    }
} else {
    $response['error'][] = "Nessun file ricevuto.";
}

header("Content-Type: application/json");
echo json_encode($response);
?>
