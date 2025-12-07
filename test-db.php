<?php
include $_SERVER['DOCUMENT_ROOT'].'/../secure_config/config.php';

// SQL query to fetch data
$sql = "SELECT baslik, icerik FROM yazilar";
$result = $conn->query($sql);

// Check if there are any records
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo "<h2>" . htmlspecialchars($row["baslik"]) . "</h2>"; // Title
        echo "<p>" . nl2br(htmlspecialchars($row["icerik"])) . "</p>"; // Content
        echo "<hr>";
    }
} else {
    echo "No entries found."; // If no records exist
}

$conn->close();
?>
