const html = `
<!DOCTYPE html>
<html>
  <head><title>URL Shortener Admin</title></head>
  <body>
    <h2>Rút gọn link</h2>
    <form method="POST">
      <label>Slug: <input name="slug" /></label><br/>
      <label>URL: <input name="url" /></label><br/>
      <button type="submit">Lưu</button>
    </form>
  </body>
</html>
`

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const pathname = url.pathname

    if (pathname === "/admin") {
      if (request.method === "GET") {
        return new Response(html, {
          headers: { "content-type": "text/html" },
        })
      }

      if (request.method === "POST") {
        const formData = await request.formData()
        const slug = formData.get("slug")
        const target = formData.get("url")
        if (!slug || !target) return new Response("Thiếu thông tin", { status: 400 })
        await env.LINKS.put(slug, target)
        return new Response(`Đã lưu: ${slug} → ${target}`, { status: 200 })
      }
    }

    const slug = pathname.slice(1)
    const target = await env.LINKS.get(slug)
    if (target) {
      return Response.redirect(target, 302)
    }

    return new Response("Không tìm thấy link rút gọn.", { status: 404 })
  },
}
