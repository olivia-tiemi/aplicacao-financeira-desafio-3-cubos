const express = require("express");
const cors = require("cors");
const app = express();
const rota = require("./routes");
const PORTA = 8000;

app.use(cors());

app.use(express.json());

app.use(rota);

app.listen(PORTA, () => console.log(`Ouvindo a porta ${PORTA}`));
