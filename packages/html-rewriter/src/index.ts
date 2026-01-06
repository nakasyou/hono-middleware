import type { HTMLRewriter as CFHTMLRewriter } from '@cloudflare/workers-types'
import type { MiddlewareHandler } from 'hono'
import { createMiddleware } from 'hono/factory'
import type { HTMLRewriter as StandardHTMLRewriter } from 'htmlrewriter'

type HTMLRewriter = CFHTMLRewriter | InstanceType<typeof StandardHTMLRewriter>
type HTMLRewriterInitializer = () => HTMLRewriter

const getDefaultRewriter = (): HTMLRewriterInitializer | null => {
  // Cloudflare Workers
  if ('HTMLRewriter' in globalThis) {
    return () => new (globalThis as {
      HTMLRewriter: {
        new (): CFHTMLRewriter
      }
    } & typeof globalThis).HTMLRewriter()
  }

  return null
}

declare module 'hono' {
  interface ContextVariableMap {
    htmlRewriter: HTMLRewriter
  }
}

export const htmlRewriter = (
  userInputRewriter?: HTMLRewriterInitializer
): MiddlewareHandler => {
  const getRewriter = userInputRewriter ?? getDefaultRewriter()
  if (!getRewriter) {
    throw new Error('HTMLRewriter is not available in this environment. Please provide a custom HTMLRewriter constructor.')
  }

  return createMiddleware(async (c, next) => {
    const rewriter = getRewriter()
    c.set('htmlRewriter', rewriter)
    await next()
    if (!c.res.headers.get('Content-Type')?.startsWith('text/html')) {
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedResponse = rewriter.transform(c.res as any) as unknown as Response
    c.res = transformedResponse
  })
}
