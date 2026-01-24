export function success(data, message = "Success") {
  return Response.json(
    {
      success: true,
      message,
      data,
    },
    { status: 200 },
  );
}

export function error(message, status = 400) {
  return Response.json(
    {
      success: false,
      message,
    },
    { status },
  );
}
