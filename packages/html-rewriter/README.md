# HTML Rewriter Middleware for Hono

[![codecov](https://codecov.io/github/honojs/middleware/graph/badge.svg?flag=hello)](https://codecov.io/github/honojs/middleware)

This is a middleware for [Hono](https://hono.dev/) that integrates HTMLRewriter functionality, allowing you to manipulate HTML responses easily.

About HTMLRewriter:
* Cloudflare Workers: https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/
* Bun: https://bun.com/docs/runtime/html-rewriter

## Usage

```ts
import { htmlRewriter } from '@hono/html-rewriter'
import { Hono } from 'hono'

const app = new Hono()

app.use('*', htmlRewriter())
app.use(async (c, next) => {
  c.var.htmlRewriter.on('div', {
    element(element) {
      element.setAttribute('X-Message', 'Hello!')
    },
  })
  await next()
})

export default app
```

Alternatively, you can provide your own HTMLRewriter instance:

```ts
import { htmlRewriter } from '@hono/html-rewriter'
import { Hono } from 'hono'
import { HTMLRewriter } from 'htmlrewriter' // or other HTMLRewriter implementations

const app = new Hono()

app.use('*', htmlRewriter(() => new HTMLRewriter()))

app.use(async (c, next) => {
  c.var.htmlRewriter.on('div', {
    element(element) {
      element.setAttribute('X-Message', 'Hello!')
    },
  })
  await next()
})

export default app
```

## Author

Shotaro Nakamura <https://github.com/nakasyou>

## License

MIT
