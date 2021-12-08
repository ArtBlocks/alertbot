import { getArtblockInfo, getOpenseaInfo } from "../api_data";
import { enqueueTokensForAlert } from "../alerts";
var assert = require("assert");
const nock = require("nock");

describe("api_data", () => {
  describe("#getArtblockInfo", () => {
    before(() => {
      const tokenScope = nock("https://token.artblocks.io")
        .get("/1")
        .reply(200, {
          name: "Recursion #1",
          image: "https://media.artblocks.io/1.png",
          external_url: "https://www.artblocks.io/token/1",
        });
      const imgScope = nock("https://media.artblocks.io")
        .get("/1.png")
        .reply(200, {
          data: new ArrayBuffer(8),
        });
      tokenScope;
      imgScope;
    });
    it("gets additional meta needed for alert", async () => {
      const { name, image, external_url, imgBinary } = await getArtblockInfo(
        "1"
      );
      assert.equal(name, "Recursion #1");
      assert.equal(image, "https://media.artblocks.io/1.png");
      assert.equal(external_url, "https://www.artblocks.io/token/1");
      const buffer = Buffer.isBuffer(imgBinary);
      assert.equal(buffer, true);
    });
  });
  describe("#getOpenseaInfo", () => {
    const account = "0x104e1e2725dbbd2d75eb1a46e880932d2e1d4c12";
    before(() => {
      const openSeaScope = nock("https://api.opensea.io")
        .get(`/account/${account}/`)
        .reply(200, { data: { user: { username: "ABKING123" } } });
      openSeaScope;
    });
    it("gets owner data for alert", async () => {
      const mintedBy = await getOpenseaInfo(account);
      assert.equal(mintedBy, "ABKING123");
    });
  });
});