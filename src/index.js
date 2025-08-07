const homepage = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Trang chủ</title>
  </head>
  <body>
    <h1>Chào mừng đến với URL Shortener</h1>
    <p>Vui lòng thêm đường dẫn sau tên miền để chuyển hướng.</p>
  </body>
</html>`;

const adminPage = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>URL Shortener Admin</title>
  </head>
  <body>
    <h2>Rút gọn link</h2>
    <form method="POST">
      <label>Slug: <input name="slug" /></label><br/>
      <label>URL: <input name="url" /></label><br/>
      <button type="submit">Lưu</button>
    </form>
  </body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Trang chủ
    if (pathname === "/") {
      return new Response(homepage, {
        headers: { "Content-Type": "text/html; charset=UTF-8" },
      });
    }

    // Trang quản trị admin
    if (pathname === "/admin") {
      if (request.method === "GET") {
        return new Response(adminPage, {
          headers: { "Content-Type": "text/html; charset=UTF-8" },
        });
      }

      if (request.method === "POST") {
        const formData = await request.formData();
        const slug = formData.get("slug");
        const target = formData.get("url");

        if (!slug || !target) {
          return new Response("Thiếu thông tin", { status: 400 });
        }

        await env.LINKS.put(slug, target);
        return new Response(`Đã lưu: ${slug} → ${target}`, { status: 200 });
      }
    }

    // Xử lý redirect
    const slug = pathname.slice(1);
    const target = await env.LINKS.get(slug);

    if (target) {
      return Response.redirect(target, 302);
    }

    return new Response("Không tìm thấy link rút gọn.", { status: 404 });
  },
};
