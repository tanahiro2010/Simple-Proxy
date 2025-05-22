import { RequestHeader } from 'hono/utils/headers';
import { rendring } from './utils/rendring';
import { Hono } from 'hono'

interface Env {
  Bindings: {
    headers: Record<RequestHeader, string>;
    host: string;
    url: string;
  };
}

const app = new Hono<Env>();
app.use('/', async (c, next) => {
  const url = c.req.query('url');
  if (!url) {
    return c.html("<form><input name='url' /></form><script src=\"https://adm.shinobi.jp/s/d8950ccd4a3bb27d74a7c399f760101d\"></script>");
  }
  c.env.url = url;

  const baseUri = new URL(url);
  const host = `${baseUri.protocol}//${baseUri.host}`;
  c.env.host = host;
  console.log(url);

  const header = c.req.header();
  const headers: Record<string, string> = {
    Host: host,
    Referer: url,
    Origin: host
  }

  Object.entries(header).forEach(([key, value]: Array<string>) => {
    if (!(key.toLowerCase() in ['host', 'referer', 'origin'])) {
      headers[key] = value;
    }
  });

  c.env.headers = headers;

  await next();
});


app.get('/', async (c) => {
  const url = c.env.url;
  const host = c.env.host;
  const headers = c.env.headers;

  const response = await fetch(url, {
    headers
  });

  if (response.headers.get('Content-Type')?.includes('html')) {
    return await rendring(response, host);
  }

  return new Response(response.body, response);
});

app.post('/', async (c) => {
  const url = c.env.url;
  const host = c.env.host;
  const headers = c.env.headers;

  const response = await fetch(url, {
    method: 'post',
    body: await c.req.arrayBuffer(),
    headers
  });

  if (response.headers.get('Location')) {
    const location = new URL(headers['Location'], host);
    response.headers.set('Location', `/?url=${location.href}`);
  }

  if (response.headers.get('Content-Type')?.includes('html')) {
    return await rendring(response, host);
  }

  return new Response(response.body, response);
});

export default app;