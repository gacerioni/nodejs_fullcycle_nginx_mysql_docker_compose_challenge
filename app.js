const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Function to establish a database connection with retry logic
function connectToDatabase() {
  const connection = mysql.createConnection({
    host: 'db', // Nome do serviço no docker-compose
    user: 'root', // Ajuste conforme necessário
    password: 'password', // Ajuste conforme necessário
    database: 'fullcycle' // Ajuste conforme necessário
  });

  // Attempt to connect
  connection.connect(err => {
    if (err) {
      console.error('Erro ao conectar ao DB:', err);
      console.log('Tentando reconectar em 5 segundos...');
      setTimeout(connectToDatabase, 5000); // Try to reconnect every 5 seconds
      return;
    }

    console.log('Conectado ao DB com sucesso.');

    // Create the table if it doesn't exist
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS people (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      )
    `;
    connection.query(createTableSql, err => {
      if (err) {
        return console.error('Erro ao criar a tabela "people":', err);
      }
      console.log('"people" tabela verificada/criada com sucesso');
    });

    setupExpressApp(connection); // Proceed to set up the Express app
  });

  // Handle connection errors after initial connection
  connection.on('error', err => {
    console.error('Database error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      connectToDatabase(); // Reconnect if the connection is closed
    } else {
      throw err;
    }
  });
}

// Set up the Express application
function setupExpressApp(connection) {
  app.get('/', (req, res) => {
    const nome = "NomeAleatorio" + Math.floor(Math.random() * 1000); // Gera um nome aleatório
    connection.query(`INSERT INTO people (name) VALUES ('${nome}')`, (err, results) => {
      if (err) throw err;

      // Após inserir, busca todos os nomes
      connection.query('SELECT name FROM people', (err, results) => {
        if (err) throw err;

        let nomes = results.map(row => row.name).join('<br>'); // Junta todos os nomes com <br> para exibição em HTML
        res.send(`<h1>Full Cycle Rocks!</h1><br>${nomes}`); // Envia a lista de nomes na resposta
      });
    });
  });

  app.listen(port, () => {
    console.log(`Aplicação rodando na porta ${port}`);
  });
}

connectToDatabase(); // Start the process
