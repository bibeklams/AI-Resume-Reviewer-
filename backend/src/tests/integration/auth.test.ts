import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../app.js";

// describe("Auth API - Register", () => {
//   it("should register a user with valid data", async () => {
//     const response = await request(app).post("/api/auth/register").send({
//       name: "Bibek",
//       email: "bibeklama123asd@gmail.com",
//       password: "StrongPass123!",
//     });

//     console.log(response.status);
//     console.log(response.body);

//     expect(response.status).toBe(201);
//   });
// });

// describe("Auth API - Email Verified", () => {
//   it("should register a user with valid data", async () => {
//     const response = await request(app).post("/api/auth/verify-email").send({
//       email: "bibeklama123asd@gmail.com",
//       otp: "830119",
//     });

//     console.log(response.status);
//     console.log(response.body);

//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe("Email already verified");
//   });
// });

// describe("Auth API - Login", () => {
//   it("should register a user with valid data", async () => {
//     const response = await request(app).post("/api/auth/login").send({
//       email: "bibeklama123asd@gmail.com",
//       password: "StrongPass123!",
//     });

//     console.log(response.status);
//     console.log(response.body);

//     expect(response.status).toBe(200);
//   });
// });

// describe("Auth API - Logout", () => {
//   it("should logout successfully", async () => {
//     const agent = request.agent(app);

//     // Step 1: Login
//     const loginResponse = await agent.post("/api/auth/login").send({
//       email: "bibeklama123asd@gmail.com",
//       password: "StrongPass123!",
//     });

//     expect(loginResponse.status).toBe(200);

//     // Step 2: Logout using the cookies from login
//     const logoutResponse = await agent.post("/api/auth/logout");

//     expect(logoutResponse.status).toBe(200);
//   });
// });

// describe("Auth API - Refresh Token", () => {
//   it("should reject a request without a refresh token", async () => {
//     const response = await request(app).post("/api/auth/refresh-token");

//     expect(response.status).toBe(401);
//   });
// });

describe("Auth API - Profile", () => {
  it("should get the logged-in user's profile", async () => {
    const agent = request.agent(app);

    // 1. Login first
    const loginResponse = await agent.post("/api/auth/login").send({
      email: "bibeklama123asd@gmail.com",
      password: "StrongPass123!",
    });

    expect(loginResponse.status).toBe(200);

    // 2. Request the profile using the saved cookies
    const response = await agent.get("/api/auth/profile");
    console.log(response.body.user);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
