export function success(data, status = 200) {
  return Response.json({ success: true, data }, { status });
}

export function error(message, status = 400, code) {
  const body = { success: false, error: message };
  if (code) body.code = code;
  return Response.json(body, { status });
}
