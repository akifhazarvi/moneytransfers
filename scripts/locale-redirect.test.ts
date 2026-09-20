import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import middleware from "../src/middleware";

test("legacy English URLs permanently redirect and preserve query parameters", () => {
  for (const [path, target] of [
    ["/en", "/"],
    ["/en/", "/"],
    ["/en/send-money/usa-to-india?amount=5000&from=USD", "/send-money/usa-to-india?amount=5000&from=USD"],
  ]) {
    const response = middleware(new NextRequest(`https://sendmoneycompare.com${path}`));
    assert.equal(response.status, 301);
    assert.equal(response.headers.get("location"), `https://sendmoneycompare.com${target}`);
  }
});
