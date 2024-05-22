import express from 'express';
const app = express();
app.use(express.json());

import cors from "cors";
app.use(cors({
    credentials: true,
    origin: true
}));

import cookieParser from "cookie-parser";
app.use(cookieParser());

import usersRouter from "./routers/usersRouter.js"
app.use(usersRouter);

import groupRouter from "./routers/groupRouter.js";
app.use(groupRouter);

import expenseRouter from "./routers/expenseRouter.js";
app.use(expenseRouter);

import inviteRouter from "./routers/inviteRouter.js"
app.use(inviteRouter);

const PORT = 8080
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));