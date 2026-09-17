const Notification =
  require("../models/Notification");

const createNotification =
  async (
    utilisateur,
    type,
    message
  ) => {
    return Notification.create({
      utilisateur,
      type,
      message
    });
  };

const getNotifications =
  async (utilisateur) => {
    return Notification.find({
      utilisateur
    }).sort({
      createdAt: -1
    });
  };

const markAsRead =
  async (id) => {
    return Notification.findByIdAndUpdate(
      id,
      { lu: true },
      { new: true }
    );
  };

module.exports = {
  createNotification,
  getNotifications,
  markAsRead
};