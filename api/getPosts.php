<?php
// 1. DÜZELTME: Config dosyasına doğru yolu veriyoruz. 
// getPosts.php'den (public_html/api) iki seviye yukarı çıkarak secure_config'e ulaşırız.
$config = require __DIR__ . '/../../secure_config/config.php';

// Veritabanı bağlantısı kuruluyor
$conn = new mysqli(
    $config['host'],
    $config['username'],
    $config['password'],
    $config['database']
);

header('Content-Type: application/json');

// 2. HATA KONTROLÜ: Eğer bağlantı başarısız olursa
if ($conn->connect_error) {
    http_response_code(500); // 500 Internal Server Error
    
    // Hatanın detayını (güvenlik nedeniyle) göstermeden temiz bir JSON yanıtı döndür
    echo json_encode([
        "status" => "error",
        "message" => "Veritabanı bağlantısı BAŞARISIZ oldu. Config dosyasındaki host, kullanıcı adı veya şifreyi kontrol edin."
    ]); 
    exit();
}

// Eğer bu noktaya gelirse, bağlantı başarılıdır.
http_response_code(200);
echo json_encode([
    "status" => "success",
    "message" => "Veritabanı bağlantısı BAŞARILI. Şimdi sorgu kısmına geçebiliriz."
]);

$conn->close();
?>