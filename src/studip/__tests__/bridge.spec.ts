import { config } from "dotenv";
import "jest";
import { getSearchResult } from "../bridge";

config();

describe("Bridge", () => {
  it("should return correct search result", async () => {
    const result = await getSearchResult("Nico Finkernagel");

    expect(result).not.toBeNull();
    expect(result?.users.length).toBeGreaterThan(0);

    for (const element of result?.users || []) {
      expect(element).toHaveProperty("name");
      expect(element).toHaveProperty("url");
    }
  }, 30000);

  it("should return null", async () => {
    const result = await getSearchResult("akjbrgoabrogjbaorugbaorubgairbgwR");
    expect(result).toBeNull();
  }, 30000);
});
