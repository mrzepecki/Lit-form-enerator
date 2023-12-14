import express from 'express'
import cors from 'cors'
import bodyParser from "body-parser";
import jsonData from './response.json' assert { type: "json" }

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors())

// Endpoint GET /api/simple-form
app.get('/api/simple-form', (req, res) => {
  res.json(jsonData);
});

// Endpoint POST /api/send-form
app.post('/api/send-form', (req, res) => {
  const formData = req.body;

  console.log(formData)

  if (validateFormData(formData)) {
    res.status(200).send('Formularz został pomyślnie przesłany.');
  } else {
    res.status(500).send('Wystąpił błąd podczas przetwarzania formularza.');
  }
});

function validateFormData(formData) {
  return formData && Object.keys(formData).length > 0;
}

app.listen(port, () => {
  console.log(`Serwer nasłuchuje na porcie ${port}`);
});
