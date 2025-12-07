<?php
// PHP dosyasının bulunduğu dizinden (public_html/api/) iki seviye yukarı çıkarak 
// (public_html'in dışına) secure_config dosyasını yükler.
$config = require __DIR__ . '/../../secure_config/config.php'; 

$conn = new mysqli(
    $config['host'],
    $config['username'],
    $config['password'],
    $config['database']
);

header('Content-Type: application/json');

// --- 1. HATA KONTROLÜ: Veritabanı Bağlantısı ---
if ($conn->connect_error) {
    http_response_code(500); // 500 Internal Server Error
    // Detaylı hatayı göstermeyin:
    echo json_encode(["error" => "Veritabanı bağlantısı kurulamadı. (Hata kodu: " . $conn->connect_errno . ")"]); 
    exit();
}

$result = $conn->query("SELECT * FROM posts ORDER BY date DESC");

// --- 2. HATA KONTROLÜ: SQL Sorgusu ---
if ($result === false) {
    http_response_code(500);
    echo json_encode(["error" => "SQL Sorgusu başarısız oldu. 'posts' tablosu adını kontrol edin."]); 
    $conn->close();
    exit();
}

$posts = [];

while($row = $result->fetch_assoc()) {
    // Güvenlik ve veri temizliği için post verilerini çekmeden önce
    // bu satırda temizleme (sanitizasyon) yapmak iyi bir pratik olabilir.
    $posts[] = $row;
}

echo json_encode($posts);

// Bağlantıyı kapatmak iyi bir pratiktir
$conn->close();

?>