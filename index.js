const express = require("express");
const app = express();
const { WebhookClient,Suggestion  } = require("dialogflow-fulfillment");
//const {Card, Suggestion, Payload} = require('dialogflow-fulfillment');
const axios = require('axios');

app.get("/hell", function (req, res) {
  res.send("Hello World");
});


app.post("/webhook", express.json(), function (req, res) {
  const agent = new WebhookClient({ request: req, response: res });
 // console.log("Dialogflow Request headers: " + JSON.stringify(req.headers));
 // console.log("Dialogflow Request body: " + JSON.stringify(req.body));

  function welcome(agent)
  {
    agent.add(`Hola, ¿en qué puedo ayudarte?`);
    agent.add(`¿Qué deseas hacer?`);
    agent.add(new Suggestion('Visualizar categorías'));
    agent.add(new Suggestion('Ver productos por categoría'));
    agent.add(new Suggestion('Total productos por categoría'));
    agent.add(new Suggestion('Ver más opciones...'));
  }

  function viewOptions(agent)
  {
    agent.add(`Por favor, selecciona una opción:`);
    agent.add(new Suggestion('Insertar categoría'));
    agent.add(new Suggestion('Insertar productos'));
    agent.add(new Suggestion('Insertar usuarios'));
    agent.add(new Suggestion('Ver documentación de la api'));
  }

  function InsertCategoria()
  {
    //window.location.reload();
  }

  function getProductsByCategoryTwo(agent)
  {
    const category = agent.parameters.category;
    console.log(category);
    return axios.get('https://backend-production-7023.up.railway.app/api/get-products/'+category)
    .then(response =>
    {
        const products = response.data.products;

        // Verifica que products exista y sea un array
        if (Array.isArray(products))
        {
            if (products.length == 1)
            {
              agent.add(`Los productos disponibles de la categoría ${category} son:`);
              agent.add('1. ' + products[0].name);

            } else if (products.length > 0)
            {
              agent.add(`Los productos disponibles de la categoría  ${category} son:`);
              let i = 1;
              products.forEach(prod => {
                  agent.add(i + '. ' + prod.name);
                  i++;
              });
            } else
            {
              agent.add(`No se encontraron productos para la categoría ${category}.`);
            }
        } else if (products && typeof products === 'object')
        {
            // Si products no es un array pero es un objeto
            agent.add(`El producto disponible para la categoría ${category} es:`);
            agent.add('1. ' + products.name);
        } else
        {
            agent.add(`No se encontraron productos para la categoría ${category}.`);
        }
        agent.add(new Suggestion("Regresar al menu anterior"));
        agent.add(new Suggestion("Finalizar"));
    })
    .catch(error => {
        console.error('Error al obtener los productos:', error);
    });
  }

  function getCategories(agent)
  {
    return axios.get('https://backend-production-7023.up.railway.app/api/all-categories')
      .then(response => {
        const { categories } = response.data;
        if (categories.length > 0)
        {
          agent.add(`Las categorías disponibles son:`);
          let i = 1;
          categories.forEach(category =>
          {
            agent.add(i+'. ' + category.name);
            i++;
          });
         
        agent.add(new Suggestion("Regresar al menu anterior"));
        agent.add(new Suggestion("Finalizar"));
        } else {
          agent.add('No se encontraron categorías.');
        }
      })
      .catch(error => {
        console.error('Error al obtener categorías:', error);
        agent.add('Lo siento, hubo un error al obtener las categorías.');
      });
  }

  function getCategoriesSugestions(agent)
  {
    return axios.get('https://backend-production-7023.up.railway.app/api/all-categories')
      .then(response => {
        const { categories } = response.data;
        if (categories.length > 0)
        {
          agent.add(`Las categorías disponibles son:`);
          agent.add('Por favor seleccione una categoría para los procutos asociados a ella:');
          categories.forEach(category =>
          {
            agent.add(new Suggestion(category.name));
          });
         
        agent.add(new Suggestion("Regresar al menu anterior"));
        agent.add(new Suggestion("Finalizar"));
        } else {
          agent.add('No se encontraron categorías.');
        }
      })
      .catch(error => {
        console.error('Error al obtener categorías:', error);
        agent.add('Lo siento, hubo un error al obtener las categorías.');
      });
  }

  function getCategoriesSugestionsTotalProducts(agent)
  {
    return axios.get('https://backend-production-7023.up.railway.app/api/all-categories')
      .then(response => {
        const { categories } = response.data;
        if (categories.length > 0)
        {
          agent.add(`Las categorías disponibles son:`);
          agent.add('Por favor seleccione una categoría para ver el total de productos que tiene:');
          categories.forEach(category =>
          {
            agent.add(new Suggestion(category.id+'. '+category.name));
          });
         
        agent.add(new Suggestion("Regresar al menu anterior"));
        agent.add(new Suggestion("Finalizar"));
        } else {
          agent.add('No se encontraron categorías.');
        }
      })
      .catch(error => {
        console.error('Error al obtener categorías:', error);
        agent.add('Lo siento, hubo un error al obtener las categorías.');
      });
  }

  function totalProductsCategory(agent)
  {
    const category = agent.parameters.Category;
    console.log(category)
    return axios.get('https://backend-production-7023.up.railway.app/api/get-total-products/'+category)
    .then(response =>
    {
      const products = response.data;
      agent.add(`El total de productos disponibles para la categoría ${category} es:`);
      agent.add('Cantidad :' + products.Total);
      agent.add(new Suggestion("Regresar al menu anterior"));
      agent.add(new Suggestion("Finalizar"));
    })
    .catch(error => {
        agent.add(`Error al obtener el total de productos de la categoría: ${category}`, error);
        agent.add(new Suggestion("Regresar al menu anterior"));
        agent.add(new Suggestion("Finalizar"));
    });
    
  }

  function getProductsByCategoryOne(agent)
  {
    return axios.get('https://backend-production-7023.up.railway.app/api/all-categories')
      .then(response => {
        const { categories } = response.data;
        if (categories.length > 0)
        {
          agent.add(`Las categorías disponibles son:`);
          agent.add('Por favor seleccione una categoría:');
          categories.forEach(category =>
          {
            agent.add(new Suggestion(category.id+ '. '+category.name));
          });
         
        agent.add(new Suggestion("Regresar al menu anterior"));
        agent.add(new Suggestion("Finalizar"));
        } else {
          agent.add('No se encontraron categorías.');
        }
      })
      .catch(error => {
        console.error('Error al obtener categorías:', error);
        agent.add('Lo siento, hubo un error al obtener las categorías.');
      });
  }
 

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("ViewCategory", getCategories);
  intentMap.set("GetProductsByCategory", getCategoriesSugestions);
  //intentMap.set("getProductsByCategoryTwo", getProductsByCategoryTwo);
  intentMap.set("getProductsByCategoryTwo", getCategoriesSugestionsTotalProducts);
  
  intentMap.set('getProductsByCategoryOne',getProductsByCategoryTwo);
  //intentMap.set('totalProductsCategory',getProductsByCategoryTwo);
  intentMap.set('totalProductsCategory',totalProductsCategory);
  intentMap.set('viewOptions',viewOptions);
  intentMap.set('InsertCategoria',InsertCategoria);
  
  agent.handleRequest(intentMap);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Estamos ejecutando el servidor en el puerto ${PORT}`);
});
