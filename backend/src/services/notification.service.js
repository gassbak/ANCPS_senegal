await createNotification(
  req.user._id,
  action.toLowerCase(),
  details
);

res.json(certification);