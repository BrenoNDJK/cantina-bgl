const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const db = new sqlite3.Database("./database.db");

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT UNIQUE,
            senha TEXT,
            tipo TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS cardapio(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            dia TEXT,
            comida TEXT
        )
    `);

    // Cria os usuários padrão

    db.get("SELECT * FROM usuarios WHERE usuario = 'tia'", (err, row) => {

        if (!row) {

            db.run(`
                INSERT INTO usuarios(usuario, senha, tipo)
                VALUES
                ('tia','123','funcionario'),
                ('aluno','123','aluno')
            `);

        }

    });

});

app.post("/login", (req, res) => {

    const { usuario, senha } = req.body;

    db.get(

        "SELECT * FROM usuarios WHERE usuario=? AND senha=?",

        [usuario, senha],

        (err, row) => {

            if (err) {

                return res.status(500).json({
                    sucesso: false
                });

            }

            if (!row) {

                return res.json({
                    sucesso: false
                });

            }

            res.json({

                sucesso: true,

                tipo: row.tipo

            });

        }

    );

});

app.get("/cardapio", (req, res) => {

    db.all(

        "SELECT * FROM cardapio ORDER BY id",

        [],

        (err, rows) => {

            if (err) {

                return res.status(500).json([]);

            }

            res.json(rows);

        }

    );

});

app.post("/cardapio", (req, res) => {

    const { dia, comida } = req.body;

    db.run(

        "INSERT INTO cardapio(dia, comida) VALUES(?,?)",

        [dia, comida],

        function (err) {

            if (err) {

                return res.status(500).json({
                    sucesso: false
                });

            }

            res.json({

                sucesso: true,

                id: this.lastID

            });

        }

    );

});

app.put("/cardapio/:id", (req, res) => {

    const id = req.params.id;

    const { dia, comida } = req.body;

    db.run(

        "UPDATE cardapio SET dia=?, comida=? WHERE id=?",

        [dia, comida, id],

        function (err) {

            if (err) {

                return res.status(500).json({
                    sucesso: false
                });

            }

            res.json({

                sucesso: true

            });

        }

    );

});

app.delete("/cardapio/:id", (req, res) => {

    const id = req.params.id;

    db.run(

        "DELETE FROM cardapio WHERE id=?",

        [id],

        function (err) {

            if (err) {

                return res.status(500).json({
                    sucesso: false
                });

            }

            res.json({

                sucesso: true

            });

        }

    );

});

app.listen(3000, () => {

    console.log("=================================");
    console.log("Servidor iniciado com sucesso!");
    console.log("http://localhost:3000");
    console.log("=================================");

});