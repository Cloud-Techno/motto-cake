<?php
include $_SERVER['DOCUMENT_ROOT'].'/../secure_config/config.php';

$sql = "SELECT title, content FROM posts ORDER BY created_at DESC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {

    while ($row = $result->fetch_assoc()) {
        echo "<h2>" . $row['title'] . "</h2>";
        echo "<p>" . nl2br($row['content']) . "</p>";
        echo "<hr>";
    }

} else {
    echo "No posts found.";
}

$conn->close();
?>
