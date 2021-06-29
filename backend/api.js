const express = require("express")
const cors = require("cors")
const app = express()
// const fetch = require("node-fetch")

app.use(cors())

const tasks = [{
  id: 1,
  title: "A title...",
}, {
  id: 2,
  title: "A title...",
}, {
  id: 3,
  title: "A title...",
}]


app.get("/ping", (req, res) => res.send("pong"))

app.get("/tasks", async (req, res) => {
  const { length } = req.query;

  await new Promise(r => setTimeout(r, 1500))

  res.send(tasks.map(t => { return { ...t, id: t.id + length } }))
})

app.listen(8085, () => console.log("Listening on 8085"))