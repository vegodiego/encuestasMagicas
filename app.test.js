const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const app = require("./app");
const request = require("supertest");
const User = require("./models/user");
const Poll = require("./models/poll");


// Integration test 

let server;
let page;
let browser;
beforeAll(async () => {
  server = app.listen(3000);
  browser = await puppeteer.launch({
    headless: true,
    args: [`--window-size=1920,1080`]
  });
  page = await browser.newPage();
});

beforeEach(async () => {
  for (var i in mongoose.connection.collections) {
    await mongoose.connection.collections[i].remove({});
  }
});

afterAll(async () => {
  server.close();
  await mongoose.disconnect();
  browser.close();
});

test("user can register and login", async () => {
  await page.goto("http://localhost:3000/");
  await page.click('a[href="/register"]');

 // register
  await page.waitFor('input[id=email]');
  await page.type("input[id=email]", "user@gmail.com");
  await page.type("input[id=password]", "123456");
  await Promise.all([
    page.waitForNavigation(),
    page.click("button[type=submit]")
  ]);
  await page.click("button[type=submit]");
  await page.waitForNavigation();;

  // login
  expect(page.url()).toBe("http://localhost:3000/login");
  await page.type("input[id=email]", "user@gmail.com");
  await page.type("input[id=password]", "123456");
  await Promise.all([
    page.waitForNavigation(),
    page.click("button[type=submit]")
  ]);
  expect(page.url()).toBe("http://localhost:3000/");   
});






// controller test 

// login function
const signIn = async (credentials) => {
  const agent = request.agent(app);
  await agent.post('/login')
      .type("form")
      .send(credentials);

  return agent;
}

describe("GET/new", () => {
  test("redirects to login if not authenticated", async () => {
    const response = await request(app).get('/new');
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe("/login");
  });

  test("responds with success code if authenticated", async () => {
    const credentials1 = { email: "user@gmail.com", password: "123456" };
    const user = await User.create(credentials1);
    //login
    const agent = await signIn(credentials1);
    // go to /new
    const response = await agent.get("/new");
    expect(response.statusCode).toBe(200);
  });
  
  // create function
  const newPoll = async (credentials, agent) => {
    await agent.post('/new')
        .type("form")
        .send(credentials);
    return agent;
  }

  test("create new poll", async () => {
    const credentials2 = { email: "user@gmail.com", password: "123456" };
    const user = await User.create(credentials2);
    //login
    const agent1 = await signIn(credentials2);
    // go to /new
    const response = await agent1.get("/new");
    const credentials3 = { title: "new poll", description: "Question description", options: [{name: "option1"},{name: "option2"}] };
    // create new poll
    const agent2 = await newPoll(credentials3, agent1);
    expect(response.statusCode).toBe(200);
  });
});