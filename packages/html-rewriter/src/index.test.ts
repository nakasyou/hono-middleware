import { Hono } from 'hono'
import { HTMLRewriter } from 'htmlrewriter'
import { htmlRewriter } from '.'

describe('Hello middleware', () => {
  const app = new Hono()

  app.use(htmlRewriter(() => new HTMLRewriter()))
  app.use(async (c, next) => {
    c.var.htmlRewriter.on('div', {
      element(element) {
        element.setInnerContent('Welcome to Hono!')
        element.setAttribute('data-hono', 'true')
      }
    })
    await next()
  })
  app.get('/hello', c => c.html('<div>Welcome to Hono!</div>'))
  app.get('/text', c => c.text('<div>Just a text response</div>'))

  it('Should be transformed', async () => {
    const res = await app.request('http://localhost/hello')
    expect(await res.text()).toBe('<div data-hono="true">Welcome to Hono!</div>')
  })
  it('Should not be transformed for non-HTML', async () => {
    const res = await app.request('http://localhost/text')
    expect(await res.text()).toBe('<div>Just a text response</div>')
  })
})
