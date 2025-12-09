<?php
include $_SERVER['DOCUMENT_ROOT'].'/../secure_config/config.php';
$conn->set_charset("utf8mb4");

$message = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $content = $_POST['content'];

    // Resim yükleme kontrolü
    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $allowed = ['jpg','jpeg','png','gif'];
        $fileName = $_FILES['image']['name'];
        $fileTmp = $_FILES['image']['tmp_name'];
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        if (in_array($fileExt, $allowed)) {
            $newFileName = 'post-' . time() . '.' . $fileExt; // Benzersiz isim
            $uploadDir = $_SERVER['DOCUMENT_ROOT'].'/blog_images/';
            $destPath = $uploadDir . $newFileName;

            if (move_uploaded_file($fileTmp, $destPath)) {
                // DB’ye sadece yol kaydediliyor
                $image_url = "https://mottocake.ch/blog_images/" . $newFileName;

                $stmt = $conn->prepare("INSERT INTO posts (title, content, created_at, image_url) VALUES (?, ?, NOW(), ?)");
                $stmt->bind_param("sss", $title, $content, $image_url);

                if ($stmt->execute()) {
                    $message = "Post başarıyla eklendi!";
                } else {
                    $message = "Veritabanına eklerken hata oluştu: " . $conn->error;
                }
                $stmt->close();
            } else {
                $message = "Dosya yüklenemedi!";
            }
        } else {
            $message = "Sadece JPG, JPEG, PNG veya GIF uzantılı dosyalar kabul edilir.";
        }
    } else {
        $message = "Resim seçilmedi veya yükleme hatası var.";
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>Yeni Blog Post Ekle</title>
</head>
<body>
    <h2>Yeni Blog Post Ekle</h2>
    <?php if($message) echo "<p>$message</p>"; ?>
    <form action="" method="post" enctype="multipart/form-data">
        <label>Başlık:</label><br>
        <input type="text" name="title" required><br><br>

        <label>İçerik:</label><br>
        <textarea name="content" rows="5" cols="50" required></textarea><br><br>

        <label>Görsel Seç:</label><br>
        <input type="file" name="image" accept="image/*" required><br><br>

        <button type="submit">Kaydet</button>
    </form>
</body>
</html>
