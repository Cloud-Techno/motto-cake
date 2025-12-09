<?php
header('Content-Type: application/json');
include $_SERVER['DOCUMENT_ROOT'].'/../secure_config/config.php';
$conn->set_charset("utf8mb4");

// Verileri çek
$sql = "SELECT title, content, created_at, image_url FROM posts ORDER BY created_at DESC";
$result = $conn->query($sql);

$posts = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $posts[] = [
            "title" => $row['title'],
            "content" => $row['content'],
            "created_at" => $row['created_at'],
            "image_url" => $row['image_url']   // <-- EKLENDİ
        ];
    }
}

echo json_encode($posts, JSON_UNESCAPED_UNICODE);

$conn->close();
?>
