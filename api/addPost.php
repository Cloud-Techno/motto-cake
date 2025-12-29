<?php
include $_SERVER['DOCUMENT_ROOT'].'/../secure_config/config.php';
$conn->set_charset("utf8mb4");

$message = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $content = $_POST['content'];

    // Check for image upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $allowed = ['jpg','jpeg','png','gif'];
        $fileName = $_FILES['image']['name'];
        $fileTmp = $_FILES['image']['tmp_name'];
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        if (in_array($fileExt, $allowed)) {
            $newFileName = 'post-' . time() . '.' . $fileExt; // Unique filename
            $uploadDir = $_SERVER['DOCUMENT_ROOT'].'/blog_images/';
            $destPath = $uploadDir . $newFileName;

            if (move_uploaded_file($fileTmp, $destPath)) {
                // Only the path is saved to the database
                $image_url = "https://mottocake.ch/blog_images/" . $newFileName;

                $stmt = $conn->prepare("INSERT INTO posts (title, content, created_at, image_url) VALUES (?, ?, NOW(), ?)");
                $stmt->bind_param("sss", $title, $content, $image_url);

                if ($stmt->execute()) {
                    $message = "Post added successfully!";
                } else {
                    $message = "Error adding to database: " . $conn->error;
                }
                $stmt->close();
            } else {
                $message = "File could not be uploaded!";
            }
        } else {
            $message = "Only JPG, JPEG, PNG, or GIF files are allowed.";
        }
    } else {
        $message = "No image selected or there was an upload error.";
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add New Blog Post</title>
</head>
<body>
    <h2>Add New Blog Post</h2>
    
    <?php if($message): ?>
        <p><strong><?php echo $message; ?></strong></p>
    <?php endif; ?>

    <form action="" method="post" enctype="multipart/form-data">
        <label for="title">Title:</label><br>
        <input type="text" id="title" name="title" required><br><br>

        <label for="content">Content:</label><br>
        <textarea id="content" name="content" rows="5" cols="50" required></textarea><br><br>

        <label for="image">Select Image:</label><br>
        <input type="file" id="image" name="image" accept="image/*" required><br><br>

        <button type="submit">Save Post</button>
    </form>
</body>
</html>