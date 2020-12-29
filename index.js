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
res.end(JSON.stringify(respuesta));
});
}

// Paso 2
if (req.url == "/candidatos" && req.method === "GET") {
    const registros = await consultar();
    fs.writeFileSync("candidatos.json",JSON.stringify(registros));
    res.end(JSON.stringify(registros));
    }

// Paso 3
if (req.url.startsWith("/candidato?") && req.method == "DELETE") {
    const { id } = url.parse(req.url, true).query;
    const respuesta = await eliminar(id);
    res.end(JSON.stringify(respuesta));
    }

// // // Paso 4
if (req.url == "/candidato" && req.method == "PUT") {
    let body = "";
    req.on("data", (payload) => {
    body += payload;
    });
    req.on("end", async () => {
    const datos = Object.values(JSON.parse(body));
    const respuesta = await editar(datos);
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
    const respuesta = await transccion(datos, res);
    res.end(JSON.stringify(respuesta));
    });
    }

// Paso 6
if (req.url == "/historial" && req.method === "GET") {
    const registros = await consultarhistorial();
    fs.writeFileSync("historial.json",JSON.stringify(registros));
    res.end(JSON.stringify(registros));
    }


// // Paso  error
//     res.writeHead(404, {'Content-Type': 'text/html'})
//     fs.readFile('404.html','utf-8',(err, file)=>{
//       if(err) throw err
//       res.write(file)
//       res.end()
//     //   res.end("Servidor funcionando =D !");
//     if (req.url == "/ejercicios" && req.method === "GET") {
//         const registros = await consultar();
//         res.statusCode = 200;
//         res.end(JSON.stringify(registros));
//         }
        
//         if (req.url == "/ejercicios" && req.method == "POST") {
//             let body = "";
//             req.on("data", (chunk) => {
//             body += chunk;
//             });
//             req.on("end", async () => {
//             const datos = Object.values(JSON.parse(body));
//             const respuesta = await insertar(datos);
//             res.statusCode = 201
//             res.end(JSON.stringify(respuesta));
//             });
//             }

//             if (req.url == "/ejercicios" && req.method == "PUT") {
//                 let body = "";
//                 req.on("data", (chunk) => {
//                 body += chunk;
//                 });
//                 req.on("end", async () => {
//                 const datos = Object.values(JSON.parse(body));
//                 await editar(datos);
//                 res.statusCode = 200;
//                 res.end("Recurso editado con éxito!");
//                 });
//                 }
//     })
})
.listen(3000);
