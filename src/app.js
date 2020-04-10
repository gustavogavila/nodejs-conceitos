const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function isItExist(request, response, next) {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(r => r.id === id);
  if (repoIndex < 0)
    return response.status(400).json({error: 'Repository not found.'});
  request.id = {idString: repositories[repoIndex].id, repoIndex};
  return next();
}

app.get("/repositories", (request, response) => response.json(repositories));

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const newRepo = {id: uuid(), title, url, techs, likes: 0};
  repositories.push(newRepo);
  return response.status(201).json(newRepo);
});

app.put("/repositories/:id", isItExist, (request, response) => {
  const { idString } = request.id;
  const { title, url, techs, likes } = request.body;
  if (likes && likes > 0) return response.json({ likes: 0 });
  return response.status(200).json({ id: idString, title, url, techs });
});

app.delete("/repositories/:id", isItExist, (request, response) => {
  const { repoIndex } = request.id;
  repositories.splice(repoIndex, 1);
  return response.status(204).json();
});

app.post("/repositories/:id/like", isItExist, (request, response) => {
  const { repoIndex } = request.id;
  repositories[repoIndex].likes += 1;
  return response.json({likes: repositories[repoIndex].likes})
});

module.exports = app;
