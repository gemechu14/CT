async function suspendCapacity(capacityId, accessToken) {
  const fetch = await import("node-fetch").then((mod) => mod.default);

  const url = `https://api.powerbi.com/v1.0/myorg/capacities/${capacityId}/suspend`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    console.log("Capacity suspended successfully.");
  } else {
    console.error(
      `Failed to suspend capacity: ${response.status}, ${await response.text()}`
    );
  }
}

module.exports = { suspendCapacity };
