import { User } from "../structures/User";

import puppeteer from "puppeteer";

export const getUserList = async (name: string): Promise<User | null> => {
  const browser = await puppeteer.launch({ headless: process.env.NODE_ENV === "development" ? true : false });
  const page = await browser.newPage();
  await page.goto("https://studip.uni-giessen.de");

  //Login
  await page.type("#loginname", process.env.STUDIP_USER);
  await page.type("#password", process.env.STUDIP_PASSWORD);

  //Wait for the new page to load
  await page.click("button[type=submit]");
  await page.waitForNavigation();

  //Enter search
  await page.click("img[alt=search]");
  await page.waitForSelector("#search-no-result");

  await page.type("#search-input", name);
  await page.waitForNavigation();

  const user = await page.$eval("#GlobalSearchUsers-body a", (e) => [e.getElementsByTagName("mark")[0]?.innerText, e.getAttribute("href")]);
  await browser.close();

  return !user ? null : { name: user[0], url: user[1] };
};
