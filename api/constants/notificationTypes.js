// this file contains the notification types used in the system. It is used in both the backend and frontend to ensure consistency.
export const NOTIFICATION_TYPES = Object.freeze({
  MESSAGE: "message", // used for direct messages between users
  LISTING_LIKED: "listing_liked", // used when a user likes a listing
  LISTING_VIEW: "listing_view", // used when a user views a listing
  PRICE_CHANGE: "price_change", // used when the price of a listing changes
  LISTING_APPROVED: "listing_approved", // used when a listing is approved
  VERIFICATION: "verification", // used for verification-related notifications
  SYSTEM: "system", // used for system-wide notifications
  PASSWORD_CHANGE: "password_change", // used when a user changes their password
  NEW_DEVICE_LOGIN: "new_device_login", // used when a user logs in from a new device
  SYSTEM_ANNOUNCEMENT: "system_announcement", // used for system-wide announcements
  ACCOUNT_SUSPENSION: "account_suspension", // used when a user's account is suspended
  AVATAR_CHANGE: "avatar_change", // used when a user changes their avatar
});

export const NOTIFICATION_TYPE_VALUES = Object.values(NOTIFICATION_TYPES);
