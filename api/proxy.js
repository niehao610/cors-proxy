// api/proxy.js
export default async function handler(request, response) {
  const targetUrl = request.query.url; // 从查询参数获取 ?url=...

  if (!targetUrl) {
    return response.status(400).send('Missing "url" query parameter.');
  }

  try {
    // 使用 fetch 去请求真实的图片地址
    const imageResponse = await fetch(targetUrl);

    // 检查请求是否成功
    if (!imageResponse.ok) {
      return response.status(imageResponse.status).send(imageResponse.statusText);
    }

    // 获取图片内容和类型
    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'application/octet-stream';

    // 设置CORS头，允许所有来源
    response.setHeader('Access-Control-Allow-Origin', '*');
    // 设置正确的图片类型
    response.setHeader('Content-Type', contentType);
    // 发送图片数据
    response.status(200).send(Buffer.from(imageBuffer));

  } catch (error) {
    return response.status(500).send(`Error fetching image: ${error.message}`);
  }
}