
export const SendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  const cookieOption = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, cookieOption).json({
    token: token,
  });
}
