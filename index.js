const http = require("http");
const url = require("url");

let items = [];
let id = 0;
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;

  // create
  if (req.method === "POST" && pathname === "/item") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const data = JSON.parse(body);
      if (!data.name) throw new Error("name does not exist");
      const item = { id: ++id, name: data.name };
      items.push(item);
      res.writeHead(201);
      res.end(JSON.stringify(item));
    });
  }

  // get
  if (req.method === "GET" && pathname === "/item") {
    res.writeHead(200);
    res.end(JSON.stringify(items));
  }

  // update
  if (req.method === "PUT" && pathname.startsWith("/item/")) {
    const itemId = parseInt(pathname.split("/").pop());
    const item = items.find((i) => i.id === itemId);
    if (!item) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Item not found" }));
      return;
    }
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const data = JSON.parse(body);
      if (data.name) item.name = data.name;
      res.writeHead(200);
      res.end(JSON.stringify(item));
    });
  }

  // delete
  if (req.method === "DELETE" && pathname.startsWith("/item/")) {
    const itemId = parseInt(pathname.split("/").pop());
    items = items.filter((i) => i.id !== itemId);
    res.writeHead(204);
    res.end();
  }
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
