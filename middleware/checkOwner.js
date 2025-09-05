function checkOwner(req, res, next) {
  const tokenUserId = parseInt(req.user.id);
  const paramId = parseInt(req.params.id);

  if (tokenUserId !== paramId) {
    return res
      .status(403)
      .json({ error: "Access denied: You can access only your own account" });
  }

  next();
}

module.exports = checkOwner;
