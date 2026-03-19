   import request from "supertest";
   import app from "../app";

   describe("App Test", () => {
     it("should return Forum Backend Running on home route", async () => {
       const response = await request(app).get("/");
       expect(response.status).toBe(200);
       expect(response.text).toBe("Forum Backend Running");
     });
   });