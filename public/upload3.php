<?php
$uploadDir = "upload/";

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$response = ['success' => [], 'error' => [], 'photos' => []];

if (isset($_FILES['photos'])) {
    $photos = $_FILES['photos'];

    // Se viene inviato un singolo file, crea un array con un unico elemento
    if (!is_array($photos['name'])) {
        $photos = [
            'name' => [$photos['name']],
            'tmp_name' => [$photos['tmp_name']],
            'type' => [$photos['type']],
            'size' => [$photos['size']],
            'error' => [$photos['error']]
        ];
    }

    for ($i = 0; $i < count($photos['name']); $i++) {
        $targetFile = $uploadDir . basename($photos['name'][$i]);

        if (move_uploaded_file($photos['tmp_name'][$i], $targetFile)) {
            $response['success'][] = "La foto {$photos['name'][$i]} è stata caricata con successo.";
            $response['photos'][] = [
                'name' => $photos['name'][$i],
                'url' => $targetFile
            ];
        } else {
            $response['error'][] = "Si è verificato un errore durante il caricamento della foto {$photos['name'][$i]}.";
        }
    }
} else {
    $response['error'][] = "Nessun file ricevuto.";
}

header("Content-Type: application/json");
echo json_encode($response);
?>
