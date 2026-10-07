
const Notification = require("../models/Notification");

const createNotification = async ({
  utilisateur,
  type,
  message
}) => {
  try {
    const notification =
      await Notification.create({
        utilisateur,
        type,
        message
      });

    return notification;
  } catch (error) {
    console.error(
      "Erreur création notification :",
      error
    );

    throw error;
  }
};

const getUserNotifications = async (
  utilisateur
) => {
  try {
    return await Notification.find({
      utilisateur
    })
      .sort({
        createdAt: -1
      })
      .lean();
  } catch (error) {
    console.error(
      "Erreur récupération notifications :",
      error
    );

    throw error;
  }
};

const markNotificationAsRead = async (
  notificationId,
  utilisateur
) => {
  try {
    return await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        utilisateur
      },
      {
        lu: true
      },
      {
        new: true
      }
    );
  } catch (error) {
    console.error(
      "Erreur lecture notification :",
      error
    );

    throw error;
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead
};
