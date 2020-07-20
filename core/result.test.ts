import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { Result, Ok, Err } from "../core/result.ts";

Deno.test("Creating Results", () => {
  const a: Result<number, string> = Ok(2);
  assert(a.isOk());
  assertEquals(a.value(), 2);

  const b: Result<number, number> = Err(2);
  assert(b.isErr());
  assertEquals(b.error(), 2);

  const c: Result<void, string> = Ok();
  assert(c.isOk());

  const d: Result<void, string> = Ok(undefined);
  assert(d.isOk());
});

Deno.test("Matching on Results", () => {
  const a: Result<string, string> = Ok(2)
    .match({
      ok: (v) => (v * 2).toString(),
      err: (e) => e,
    });

  assert(a.isOk());
  assertEquals(a.value(), "4");

  const b: Result<string, string> = Err(2)
    .match({
      ok: (v) => v,
      err: (e) => (e * 5).toString(),
    });

  assert(b.isErr());
  assertEquals(b.error(), "10");
});

interface MockResponse {
  ok: boolean,
  status: number,
  statusText: string
}

async function mockFetch(address: string, success: boolean): Promise<Result<MockResponse, MockResponse>> {
  
  if (success)
  {
    const r: MockResponse = {
      ok: true,
      status: 200,
      statusText: ""
    }

    return Ok(r)
  }
  else
  {
    const r: MockResponse = {
      ok: false,
      status: 400,
      statusText: "Failure"
    }

    return Err(r)
  }
}

Deno.test("More Complex Example", async () => {
  const successR = await mockFetch("blah", true);

  successR.match({
    ok: v => { assert(true) },
    err: e => { assert(false) }
  })

  const failureR = await mockFetch("boop", false);

  failureR
    .match({
      ok: v => { assert(false) },
      err: e => { assert(true) }
    })
})
