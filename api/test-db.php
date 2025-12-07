<?php
// public_html/test-db.php

// config.php public_html dışında olduğu için path doğru olmalı
include $_SERVER['DOCUMENT_ROOT'].'/../secure_config/config.php';

// Bağlantı testi
if ($conn->connect_error) {
    die("Bağlantı hatası: " . $conn->connect_error);
}

echo "Bağlantı başarılı!";

$conn->close();
?>
