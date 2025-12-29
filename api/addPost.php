<?php
include $_SERVER['DOCUMENT_ROOT'].'/../secure_config/config.php';
$conn->set_charset("utf8mb4");

$message = "";
$messageType = ""; // Added to style the message box

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $content = $_POST['content'];

    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $allowed = ['jpg','jpeg','png','gif'];
        $fileName = $_FILES['image']['name'];
        $fileTmp = $_FILES['image']['tmp_name'];
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        if (in_array($fileExt, $allowed)) {
            $newFileName = 'post-' . time() . '.' . $fileExt;
            $uploadDir = $_SERVER['DOCUMENT_ROOT'].'/blog_images/';
            $destPath = $uploadDir . $newFileName;

            if (move_uploaded_file($fileTmp, $destPath)) {
                $image_url = "https://mottocake.ch/blog_images/" . $newFileName;

                $stmt = $conn->prepare("INSERT INTO posts (title, content, created_at, image_url) VALUES (?, ?, NOW(), ?)");
                $stmt->bind_param("sss", $title, $content, $image_url);

                if ($stmt->execute()) {
                    $message = "Post added successfully!";
                    $messageType = "success";
                } else {
                    $message = "Error adding to database: " . $conn->error;
                    $messageType = "error";
                }
                $stmt->close();
            } else {
                $message = "File could not be uploaded!";
                $messageType = "error";
            }
        } else {
            $message = "Only JPG, JPEG, PNG, or GIF files are allowed.";
            $messageType = "error";
        }
    } else {
        $message = "No image selected or there was an upload error.";
        $messageType = "error";
    }
}
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creator Studio | Add Post</title>
    <style>
        :root {
            --primary-color: #4f46e5;
            --primary-hover: #4338ca;
            --bg-gradient: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            --card-bg: #ffffff;
            --text-main: #1f2937;
            --text-muted: #6b7280;
            --success: #10b981;
            --error: #ef4444;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: var(--bg-gradient);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 20px;
        }

        .container {
            background: var(--card-bg);
            width: 100%;
            max-width: 600px;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        h2 {
            margin-top: 0;
            color: var(--text-main);
            font-size: 24px;
            font-weight: 700;
            border-bottom: 2px solid #f3f4f6;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }

        .alert {
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 25px;
            font-size: 14px;
            font-weight: 500;
        }

        .alert-success { background: #ecfdf5; color: var(--success); border: 1px solid #d1fae5; }
        .alert-error { background: #fef2f2; color: var(--error); border: 1px solid #fee2e2; }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--text-main);
            font-size: 14px;
        }

        input[type="text"], textarea {
            width: 100%;
            padding: 12px;
            border: 1.5px solid #e5e7eb;
            border-radius: 8px;
            box-sizing: border-box;
            font-size: 15px;
            transition: all 0.3s ease;
            outline: none;
        }

        input[type="text"]:focus, textarea:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }

        input[type="file"] {
            font-size: 14px;
            color: var(--text-muted);
        }

        button {
            width: 100%;
            background-color: var(--primary-color);
            color: white;
            padding: 14px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s ease, transform 0.1s ease;
            margin-top: 10px;
        }

        button:hover {
            background-color: var(--primary-hover);
        }

        button:active {
            transform: scale(0.98);
        }

        .footer-note {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: var(--text-muted);
        }
    </style>
</head>
<body>

<div class="container">
    <h2>Create New Post</h2>
    
    <?php if($message): ?>
        <div class="alert alert-<?php echo $messageType; ?>">
            <?php echo $message; ?>
        </div>
    <?php endif; ?>

    <form action="" method="post" enctype="multipart/form-data">
        <div class="form-group">
            <label for="title">Post Title</label>
            <input type="text" id="title" name="title" placeholder="Enter a catchy title..." required>
        </div>

        <div class="form-group">
            <label for="content">Content</label>
            <textarea id="content" name="content" rows="6" placeholder="Tell your story..." required></textarea>
        </div>

        <div class="form-group">
            <label for="image">Cover Image</label>
            <input type="file" id="image" name="image" accept="image/*" required>
        </div>

        <button type="submit">Publish Post</button>
    </form>

    <div class="footer-note">
        &copy; <?php echo date("Y"); ?> Mottocake Admin Studio
    </div>
</div>

</body>
</html>