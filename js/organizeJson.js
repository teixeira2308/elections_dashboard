function cleanElectionData(rawData) {
  const cleaned = {};

  const districtsArray = Object.entries(rawData[0]); // Districts and Codes ([1, 'Aveiro'])

  rawData.forEach((row) => {
    if (row && row["Círculo"]) {
      const item = row["Círculo"]; // Item (Inscritos, Votantes, etc.)

      if (isItemValid(item)) {
        let empty = true;
        cleaned[item] = {}; // Initializes the item in the cleaned JSON

        districtsArray.forEach(([code, name]) => {
          cleaned[item][name] = row[code]; // Coloca na posição do item atual o nome do distrito e o seu número baseado no seu código
          if (row[code]) empty = false;
        });

        if (empty) delete cleaned[item];
        else cleaned[item]["Total"] = row["Total"];
      }
    }
  });

  return cleaned;
}

// Validate item
function isItemValid(item) {
  return (
    !item.includes("md") &&
    !item.includes("*") &&
    !item.includes("Observações") &&
    !item.includes("somatórios") &&
    !item.includes("%") &&
    !item.includes("VVE")
  );
}