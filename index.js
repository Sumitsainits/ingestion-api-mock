const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 4500;

app.use(express.json());

const ingestionProcesses = {};

const markProcessAsCompleted = (processId) => {
  const randomInterval = Math.floor(Math.random() * 10000) + 1000;

  setTimeout(() => {
    if (ingestionProcesses[processId]) {
      ingestionProcesses[processId].status = "Completed";
      ingestionProcesses[processId].completedAt = new Date();
    }
  }, randomInterval);
};

app.post("/ingest", (req, res) => {
  const processId = uuidv4();
  ingestionProcesses[processId] = {
    status: "In Progress",
    timestamp: new Date(),
  };

  markProcessAsCompleted();

  res.json({
    message: "Ingestion process started",
    processId,
  });
});

app.get("/ingest/status/:processId", (req, res) => {
  const { processId } = req.params;

  if (ingestionProcesses[processId]) {
    res.json({
      processId,
      status: ingestionProcesses[processId].status,
      startedAt: ingestionProcesses[processId].timestamp,
      completedAt: ingestionProcesses[processId].completedAt || null,
    });
  } else {
    res.status(404).json({
      message: "Process not found",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
