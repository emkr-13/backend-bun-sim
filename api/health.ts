import express from "express";

export default function handler(
  req: express.Request,
  res: express.Response
): void {
  res.status(200).json({ status: "ok", message: "API is running" });
}
