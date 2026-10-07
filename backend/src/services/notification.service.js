
const Notification = require("../models/Notification");

// CRÉER UNE NOTIFICATION
const createNotification = async ({
  utilisateur,
  type,
  message
}) => {
  try {
    const notification = await Notification.create({
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

// RÉCUPÉRER LES NOTIFICATIONS D'UN UTILISATEUR
const getNotifications = async (utilisateur) => {
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

// MARQUER UNE NOTIFICATION COMME LUE
const markAsRead = async (
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
  getNotifications,
  markAsRead
};
