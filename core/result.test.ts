import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { Result, Ok, Err, ResultReturnType } from "../core/result.ts";

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
  const a = Ok<number, string>(2)
    .match({
      ok: (v) => (v * 2).toString(),
      err: (e) => e,
    });

  assert(a.isOk());
  assertEquals(a.value(), "4");

  const b = Err<number, number>(2)
    .match({
      ok: (v) => v,
      err: (e) => (e * 5).toString(),
    });
  assert(b.isErr());
  assertEquals(b.error(), "10");
});
