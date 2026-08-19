export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 500;
export const PAGE_SIZE = 20;

// Matches the send-push-notification Edge Function's image handling.
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"] as const;
export const MAX_IMAGE_SIZE_BYTES = 1 * 1024 * 1024;
export const IMAGES_BUCKET = "notification-images";
