const {
  getNotifications,
  markAsRead
} = require(
  "../services/notification.service"
);

const getAll = async (req, res) => {
  try {
    const notifications =
      await getNotifications(
        req.userId
      );

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const read = async (req, res) => {
  try {
    const notification =
      await markAsRead(
        req.params.id
      );

    if (!notification) {
      return res.status(404).json({
        message: "Notification introuvable"
      });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getAll,
  read
};