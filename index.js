const http = require("http");
const url = require("url");
const { insertar, consultar, editar, eliminar, transccion, consultarhistorial} =
require("./consultas");
const fs = require("fs");

http
.createServer(async (req, res) => {
    if (req.url == "/" && req.method === "GET") {
        res.setHeader("content-type", "text/html");
        const html = fs.readFileSync("index.html", "utf8");
        res.end(html);
    }

// Paso 1
    if ((req.url == "/candidato" && req.method == "POST")) {
        let body = "";
        req.on("data", (payload) => {
            body += payload;
        });
        req.on("end", async () => {
            const datos = Object.values(JSON.parse(body));
            const respuesta = await insertar(datos);
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(JSON.stringify(respuesta));
        });
    }

// Paso 2
    if (req.url == "/candidatos" && req.method === "GET") {
        const registros = await consultar();
        res.writeHead(200, {'Content-Type': 'application/json'})
        fs.writeFileSync("candidatos.json",JSON.stringify(registros));
        res.end(JSON.stringify(registros));
    }

// Paso 3
    if (req.url.startsWith("/candidato?") && req.method == "DELETE") {
        const { id } = url.parse(req.url, true).query;
        const respuesta = await eliminar(id);
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(respuesta));
    }

// Paso 4
    if (req.url == "/candidato" && req.method == "PUT") {
        let body = "";
        req.on("data", (payload) => {
            body += payload;
        });
        req.on("end", async () => {
            const datos = Object.values(JSON.parse(body));
            const respuesta = await editar(datos);
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(JSON.stringify(respuesta));
        });
    }

// Paso 5
    if ((req.url == "/votos" && req.method == "POST")) {
        let body = "";
        req.on("data", (payload) => {
            body += payload;
        });
        req.on("end", async () => {
            const datos = Object.values(JSON.parse(body));
            let statusCode, respuesta
            if(datos[1]>0){
                respuesta = await transccion(datos, res);
                if (respuesta == undefined){
                    statusCode = 500
                }
                else {
                    statusCode = 200
                }
            }
            else{
                console.log('ingrese numero valido')
                statusCode = 403
            }
            res.writeHead(statusCode, {'Content-Type': 'application/json'})
            res.end(JSON.stringify(respuesta));
        });
    }

// Paso 6
    if (req.url == "/historial" && req.method === "GET") {
        const registros = await consultarhistorial();
        fs.writeFileSync("historial.json",JSON.stringify(registros));
        res.end(JSON.stringify(registros));
    }
})
.listen(3000);