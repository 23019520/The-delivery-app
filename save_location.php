<?php
// Database config
$host = "localhost";
$user = "root"; // change if needed
$pass = "";     // change if needed
$dbname = "ride-app";

// Connect to database
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
  exit;
}

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

$searchTerm = $data['search_term'] ?? '';
$destination = $data['destination_name'] ?? '';
$latitude = $data['latitude'] ?? 0;
$longitude = $data['longitude'] ?? 0;
$distance = $data['distance_meters'] ?? 0;
$cost = $data['estimated_cost'] ?? 0;

// Validate
if (!$searchTerm || !$destination || !$latitude || !$longitude) {
  http_response_code(400);
  echo json_encode(["error" => "Missing required fields."]);
  exit;
}

// Prepare and bind
$stmt = $conn->prepare("INSERT INTO location_requests (search_term, destination_name, latitude, longitude, distance_meters, estimated_cost) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssddid", $searchTerm, $destination, $latitude, $longitude, $distance, $cost);

// Execute
if ($stmt->execute()) {
  echo json_encode(["success" => true, "message" => "Location saved successfully."]);
} else {
  http_response_code(500);
  echo json_encode(["error" => "Database insert failed."]);
}
// Before validation, for testing only
file_put_contents("debug_log.txt", json_encode($data, JSON_PRETTY_PRINT));
if ($stmt->execute()) {
  echo json_encode([
    "success" => true,
    "message" => "Location saved successfully.",
    "data" => [
      "search_term" => $searchTerm,
      "destination_name" => $destination,
      "latitude" => $latitude,
      "longitude" => $longitude,
      "distance_meters" => $distance,
      "estimated_cost" => $cost
    ]
  ]);
}


$stmt->close();
$conn->close();
?>
