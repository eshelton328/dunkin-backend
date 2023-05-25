import express from "express";
import cors from "cors";
import cron from "node-cron";
import "./loadEnvironment.mjs";
import "express-async-errors";
import payments from "./routes/payments.mjs";
import batches from "./routes/batches.mjs";
import reports from "./routes/reports.mjs";
import queue from "./queues/queue.mjs"
import { createPaymentsQueue } from "./queues/createPayments.mjs";
import { processPaymentsQueue } from "./queues/processPayments.mjs";
import { sourceReportQueue } from "./queues/sourceReportQueue.mjs";
import { branchReportQueue } from "./queues/branchReportQueue.mjs";
import { statusReportQueue } from "./queues/statusReportQueue.mjs";

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/batch", batches);
app.use("/payment", payments);
app.use("/report", reports)

app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.")
})

// run every minute
cron.schedule('* * * * *', async () => {
  queue.process('createPayments', async (job, done) => {
    try {
        await createPaymentsQueue(job.data);
        done();
    } catch (error) {
        done(error);
    }
  });
  queue.process('processPayments', async (job, done) => {
    try {
        await processPaymentsQueue(job.data);
        done();
    } catch (error) {
        done(error);
    }
  });
  queue.process('sourceReport', async (job, done) => {
    try {
      await sourceReportQueue(job.data);
      done();
    } catch (error) {
      done(error);
    }
  });
  queue.process('branchReport', async (job, done) => {
    try {
      await branchReportQueue(job.data);
      done()
    } catch (error) {
      done(error)
    }
  })
  queue.process('statusReport', async (job, done) => {
    try {
      await statusReportQueue(job.data);
      done()
    } catch (error) {
      done(error)
    }
  })
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
