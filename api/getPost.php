<?php
header('Content-Type: application/json');
include $_SERVER['DOCUMENT_ROOT'].'/../secure_config/config.php';
$conn->set_charset("utf8mb4");

if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode(["error" => "ID fehlt"]);
    exit;
}

$id = intval($_GET['id']);

$sql = "SELECT id, title, content, created_at, image_url FROM posts WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["error" => "Beitrag nicht gefunden"]);
    exit;
}

$post = $result->fetch_assoc();
echo json_encode($post, JSON_UNESCAPED_UNICODE);

$conn->close();
?>
