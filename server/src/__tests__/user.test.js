import supertest from "supertest";

import {
  connectToMockDB,
  closeMockDatabase,
  clearMockDatabase,
} from "../__testUtils__/dbMock.js";
import { addUserToMockDB } from "../__testUtils__/userMocks.js";
import app from "../app.js";

const request = supertest(app);

beforeAll(async () => {
  await connectToMockDB();
});

afterEach(async () => {
  await clearMockDatabase();
});

afterAll(async () => {
  await closeMockDatabase();
});

describe("GET /api/user/", () => {
  it("Should return an empty array if there are no users in the db", (done) => {
    request
      .get("/api/user/")
      .then((response) => {
        expect(response.status).toBe(200);

        const { body } = response;
        expect(body.success).toBe(true);
        expect(body.result).toEqual([]);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Should return all the users in the db", async () => {
    const testUser1 = {
      firstName: "John",
      lastName: "Doe",
      hyfClass: "hyfInput",
      role: "Student",
      email: "john@doe.com",
      password: "waeraU4949__",
    };
    const testUser2 = {
      firstName: "Jane",
      lastName: "Doe",
      hyfClass: "hyfInput",
      role: "Student",
      email: "jane@doe.com",
      password: "waeraU4949__",
    };

    await addUserToMockDB(testUser1);
    await addUserToMockDB(testUser2);

    // Asynchronous tests should return a Promise
    return request.get("/api/user/").then((response) => {
      expect(response.status).toBe(200);

      const { body } = response;
      expect(body.success).toBe(true);

      const users = body.result;
      expect(users).toHaveLength(2);
      expect(
        users.filter((user) => user.firstName === testUser1.firstName)
      ).toHaveLength(1);
      expect(
        users.filter((user) => user.email === testUser1.email)
      ).toHaveLength(1);
      expect(
        users.filter((user) => user.firstName === testUser2.firstName)
      ).toHaveLength(1);
      expect(
        users.filter((user) => user.email === testUser2.email)
      ).toHaveLength(1);
    });
  });
});
