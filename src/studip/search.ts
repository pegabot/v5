/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import puppeteer from "puppeteer";
import { User } from "../structures/User";

export const getSearchResult = async (name: string): Promise<{ users: User[]; screenshot: Buffer | null } | null> => {
  const browser = await puppeteer.launch({
    headless: process.env.NODE_ENV !== "development",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1080,720"],
    defaultViewport: {
      width: 1080,
      height: 720,
    },
  });

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

  try {
    const users: User[] = await page
      .$$eval("#GlobalSearchUsers-body a", (elements) =>
        elements
          .map((e) => {
            const innerText = e.getElementsByTagName("mark")[0]?.innerText;
            return innerText ? [innerText, e.getAttribute("href")] : [];
          })
          .filter((e) => e.length > 0),
      )
      .then((elements) =>
        elements.map((e) => {
          return {
            name: e[0],
            url: e[1],
          };
        }),
      );

    const screenshot = await page.screenshot();

    await browser.close();

    return users.length < 1
      ? {
          users: [],
          screenshot: null,
        }
      : {
          users,
          screenshot: screenshot as Buffer,
        };
  } catch (e) {
    await browser.close();
    return null;
  }
};
