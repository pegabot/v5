/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import { config } from "dotenv";
import "jest";
import { getSearchResult } from "../search";

config();

describe("Search", () => {
  it("should return correct search result", async () => {
    const result = await getSearchResult("Nico Finkernagel");

    expect(result).not.toBeNull();
    expect(result?.users.length).toBeGreaterThan(0);

    for (const element of result?.users || []) {
      expect(element).toHaveProperty("name");
      expect(element).toHaveProperty("url");
    }
  }, 30000);

  it("should return an empty array", async () => {
    const result = await getSearchResult("akjbrgoabrogjbaorugbaorubgairbgwR");
    expect(result?.users.length).toBe(0);
    expect(result?.screenshot).toBeNull();
  }, 30000);
});
