const express = require("express");
const app = express();
const { WebhookClient,Suggestion } = require("dialogflow-fulfillment");
//const {Card, Suggestion, Payload} = require('dialogflow-fulfillment');
const axios = require('axios');

// URL de la API
const url = 'https://backend-production-7023.up.railway.app/api/';

app.get("/hell", function (req, res) {
  res.send("Hello World");
});


app.post("/webhook", express.json(), function (req, res) {
  const agent = new WebhookClient({ request: req, response: res });
  console.log("Dialogflow Request headers: " + JSON.stringify(req.headers));
  console.log("Dialogflow Request body: " + JSON.stringify(req.body));

  function welcome(agent)
  {
    agent.add(`Hola, ¿en qué puedo ayudarte?`);
    agent.add(`¿Qué deseas hacer?`);
    agent.add(new Suggestion('Visualizar categorías'));
    agent.add(new Suggestion('Ver productos por categoría'));
    agent.add(new Suggestion('Ver total de categorías'));
  }

  function getCategories(agent) {
    axios.get(url+'all-categories')
      .then(response => {
        // Manejar la respuesta
        const categories = response.data;
        agent.add(`Las categorías disponibles son: ${categories.join(', ')}`);
      })
      .catch(error => {
        // Manejar el error
        console.error(error);
        agent.add(`Lo siento, hubo un error al obtener las categorías.`);
      });
  }


  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
 /*  function ProbandoWebhook(agent) {
    for (let i = 1; i <= 5; i++) {
      agent.add(`Esta es la respuesta: ` + i);
    }
  } */

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("ViewCategory", getCategories);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Estamos ejecutando el servidor en el puerto ${PORT}`);
});
