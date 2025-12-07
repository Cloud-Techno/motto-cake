<?php
$config = require $_SERVER['DOCUMENT_ROOT'] . '../secure_config/config.php';

$conn = new mysqli(
    $config['host'],
    $config['username'],
    $config['password'],
    $config['database']
);

header('Content-Type: application/json');

$result = $conn->query("SELECT * FROM posts ORDER BY date DESC");

$posts = [];

while($row = $result->fetch_assoc()) {
    $posts[] = $row;
}

echo json_encode($posts);
