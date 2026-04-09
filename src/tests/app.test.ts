import request from "supertest";
import app from "../app";

describe("App Test", () => {
  it("should return 200 for root route", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });
});