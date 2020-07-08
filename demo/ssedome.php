<?php
header("Content-Type: text/event-stream\n\n");
// header("Connection: keep-alive\n\n");

$counter = rand(1, 10);
while (1) {

  // Every second, sent a "pings" event.
  echo "event: ping\n";
  $curDate = date(DATE_ISO8601);
  echo 'data: {"times": "' . $curDate . '"}';
  echo "\n\n";

  $counter--;

  // Send a simple message at random intervals.
  if (!$counter) {
    echo 'data: This is a message at time ' . $curDate . "\n\n";
    $counter = rand(1, 10);
  }

  ob_flush();
  flush();
  sleep(1);
}
?>
