const fs = require('fs');

// Données que vous souhaitez écrire dans le fichier JSON
const dataToWrite = {
  name: 'John Doe',
  age: 30,
  city: 'New York'
};

// Convertir les données en format JSON
const jsonData = JSON.stringify(dataToWrite, null, 2); // Le deuxième argument (null) et le troisième argument (2) sont pour l'espacement et la mise en forme du JSON.

// Chemin du fichier où vous souhaitez écrire les données JSON
const filePath = 'data.json';

// Écrire les données JSON dans le fichier
fs.writeFile(filePath, jsonData, 'utf8', (err) => {
  if (err) {
    console.error('Erreur lors de l\'écriture du fichier :', err);
  } else {
    console.log('Données JSON ont été écrites dans le fichier avec succès.');
  }
});
