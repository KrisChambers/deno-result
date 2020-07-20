# Result Types

This is a basic library for using Rust like Result types. Results in rust are a particularly nice alternative to try / catch blocks and, in my opinion makes dealing with errors nicer to work with.

Obviously there are some limitations with bringing these constructs over from rust. Namely, typescript does not support them out of the box, and since there is no borrow checker you could unwrap a result more than once. But the goal here is not to reproduce rust semantics, just to test out a possible alternative way of error handeling.

# Example

```typescript
async function getData(addr: string): Promise<Result<Response, Response>> {
    const response = await fetch(addr);

    if (response.ok)    return Ok(response);
    else                return Err(response);
}

const responseR = await getData("http....");

const response = responseR
    .match({
        ok: r => r,
        err: r => `Error ${r.status}: ${r.statusText}`
    })
```