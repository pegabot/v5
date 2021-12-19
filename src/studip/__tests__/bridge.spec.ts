import { config } from "dotenv";
import "jest";
import { getSearchResult } from "../bridge";

config();

describe("Bridge", () => {
  it("should return correct search result", async () => {
    const result = await getSearchResult("Nico Finkernagel");

    expect(result).not.toBeNull();
    expect(result?.length).toBeGreaterThan(0);

    for (const element of result || []) {
      expect(element[0]).toHaveProperty("name");
      expect(element[0]).toHaveProperty("url");
    }
  }, 30000);

  it("should return null", async () => {
    const result = await getSearchResult("akjbrgoabrogjbaorugbaorubgairbgwR");
    expect(result).toBeNull();
  }, 30000);
});
