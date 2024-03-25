const express = require('express');
const mysql = require('mysql2'); // Alterado para mysql2 que suporta melhor o MySQL 8
const app = express();
const port = 3000;

// Conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'db', // Nome do serviço no docker-compose
  user: 'root', // Ajuste conforme necessário
  password: 'password', // Ajuste conforme necessário
  database: 'fullcycle' // Ajuste conforme necessário
});

connection.connect(err => {
  if (err) {
    return console.error('Erro ao conectar ao DB:', err);
  }
  console.log('Conectado ao DB com sucesso.');

  // Cria a tabela se ela não existir
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
});

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
