export interface Dictionary {
  common: {
    cancel: string;
    close: string;
    dismiss: string;
    cannotBeUndone: string;
  };
  languageSelector: {
    heading: string;
    subheading: string;
    continue: string;
  };
  sidebar: {
    notifications: string;
    logout: string;
    language: string;
  };
  login: {
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    submit: string;
    submitting: string;
    invalidCredentials: string;
    emailRequired: string;
    passwordRequired: string;
  };
  enums: {
    audience: {
      all: string;
      free: string;
      paid: string;
      monthly: string;
      yearly: string;
      expired: string;
    };
    status: {
      processing: string;
      sent: string;
      partial: string;
      failed: string;
    };
    notificationType: {
      Recipe: string;
      Blog: string;
      Video: string;
      Tip: string;
      "Season Calendar": string;
    };
  };
  notificationsList: {
    pageTitle: string;
    createButton: string;
    searchLabel: string;
    searchPlaceholder: string;
    statusLabel: string;
    audienceLabel: string;
    filterAll: string;
    columns: {
      title: string;
      description: string;
      audience: string;
      type: string;
      image: string;
      status: string;
      created: string;
      sent: string;
      actions: string;
    };
    viewAction: string;
    deleteAction: string;
    deleteModalTitle: string;
    deleteModalDescription: string;
    deleteConfirmLabel: string;
    deleteSuccessToast: string;
    deleteFileWarningToast: string;
    deleteErrorToast: string;
    errorTitle: string;
    errorDescription: string;
    retryButton: string;
    emptyFilteredTitle: string;
    emptyFilteredDescription: string;
    emptyTitle: string;
    emptyDescription: string;
    createFirstButton: string;
    showingRange: (from: number, to: number, total: number) => string;
    pageOf: (page: number, totalPages: number) => string;
    previousPage: string;
    nextPage: string;
  };
  notificationCreate: {
    pageTitle: string;
    titleLabel: string;
    titlePlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    audienceLabel: string;
    typeLabel: string;
    imageLabel: string;
    imageOptional: string;
    chooseImage: string;
    maxImageSize: (size: string) => string;
    removeImageAria: string;
    createButton: string;
    cancelButton: string;
    confirmTitle: string;
    confirmTitleField: string;
    confirmAudienceField: string;
    confirmTypeField: string;
    confirmImageField: string;
    sendingButton: string;
    confirmSendButton: string;
    titleRequired: string;
    titleTooLong: (max: number) => string;
    descriptionRequired: string;
    descriptionTooLong: (max: number) => string;
    onlyJpegPng: string;
    imageTooLarge: string;
    sentToast: (sent: number, total: number) => string;
    partialToast: (sent: number, failed: number) => string;
    failedToast: string;
    processingToast: string;
    sendErrorToast: string;
  };
  notificationView: {
    pageTitle: string;
    backToListing: string;
    descriptionLabel: string;
    audienceLabel: string;
    typeLabel: string;
    createdByLabel: string;
    createdDateLabel: string;
    sentDateLabel: string;
    usersMatchedLabel: string;
    sentLabel: string;
    failedLabel: string;
    imageLabel: string;
    imageUnavailable: string;
    deleteButton: string;
    notFoundTitle: string;
    notFoundDescription: string;
    deleteModalTitle: string;
    deleteModalDescription: string;
    deleteConfirmLabel: string;
    deleteSuccessToast: string;
    deleteFileWarningToast: string;
    deleteErrorToast: string;
  };
}

export const en: Dictionary = {
  common: {
    cancel: "Cancel",
    close: "Close",
    dismiss: "Dismiss",
    cannotBeUndone: "This cannot be undone.",
  },
  languageSelector: {
    heading: "Choose your language",
    subheading: "Select the language for the admin panel. You can change this anytime from the sidebar.",
    continue: "Continue",
  },
  sidebar: {
    notifications: "Notifications",
    logout: "Logout",
    language: "Language",
  },
  login: {
    title: "Admin Login",
    subtitle: "Sign in to manage notifications.",
    emailLabel: "Email",
    emailPlaceholder: "you@komtotbloom.nl",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    submit: "Login",
    submitting: "Signing in…",
    invalidCredentials: "Invalid email or password.",
    emailRequired: "Email is required",
    passwordRequired: "Password is required",
  },
  enums: {
    audience: {
      all: "All",
      free: "Free",
      paid: "Paid",
      monthly: "Monthly",
      yearly: "Yearly",
      expired: "Expired",
    },
    status: {
      processing: "Processing",
      sent: "Sent",
      partial: "Partial",
      failed: "Failed",
    },
    notificationType: {
      Recipe: "Recipe",
      Blog: "Blog",
      Video: "Video",
      Tip: "Tip",
      "Season Calendar": "Season Calendar",
    },
  },
  notificationsList: {
    pageTitle: "Notifications",
    createButton: "Create Notification",
    searchLabel: "Search",
    searchPlaceholder: "Search by title or description…",
    statusLabel: "Status",
    audienceLabel: "Audience",
    filterAll: "All",
    columns: {
      title: "Title",
      description: "Description",
      audience: "Audience",
      type: "Type",
      image: "Image",
      status: "Status",
      created: "Created",
      sent: "Sent",
      actions: "Actions",
    },
    viewAction: "View",
    deleteAction: "Delete",
    deleteModalTitle: "Delete notification?",
    deleteModalDescription: "This will permanently delete the notification and its image.",
    deleteConfirmLabel: "Delete",
    deleteSuccessToast: "Notification deleted.",
    deleteFileWarningToast: "Notification deleted, but the image could not be removed.",
    deleteErrorToast: "Something went wrong. Please try again.",
    errorTitle: "Couldn't load notifications",
    errorDescription: "Something went wrong while fetching notifications. Please try again.",
    retryButton: "Retry",
    emptyFilteredTitle: "No matching notifications",
    emptyFilteredDescription: "Try adjusting your search or filters.",
    emptyTitle: "No notifications yet",
    emptyDescription: "Create your first notification to reach your users.",
    createFirstButton: "Create Notification",
    showingRange: (from: number, to: number, total: number) =>
      `Showing ${from}–${to} of ${total}`,
    pageOf: (page: number, totalPages: number) => `Page ${page} of ${totalPages}`,
    previousPage: "Previous page",
    nextPage: "Next page",
  },
  notificationCreate: {
    pageTitle: "Create Notification",
    titleLabel: "Title",
    titlePlaceholder: "e.g. New breathing exercise available",
    descriptionLabel: "Description",
    descriptionPlaceholder: "What should users know?",
    audienceLabel: "Audience",
    typeLabel: "Type",
    imageLabel: "Image",
    imageOptional: "(optional)",
    chooseImage: "Choose image",
    maxImageSize: (size) => `Max ${size}`,
    removeImageAria: "Remove image",
    createButton: "Create Notification",
    cancelButton: "Cancel",
    confirmTitle: "Send this notification?",
    confirmTitleField: "Title",
    confirmAudienceField: "Audience",
    confirmTypeField: "Type",
    confirmImageField: "Image",
    sendingButton: "Sending…",
    confirmSendButton: "Confirm & Send",
    titleRequired: "Title is required.",
    titleTooLong: (max: number) => `Title must be ${max} characters or fewer.`,
    descriptionRequired: "Description is required.",
    descriptionTooLong: (max: number) => `Description must be ${max} characters or fewer.`,
    onlyJpegPng: "Only JPEG or PNG images are allowed.",
    imageTooLarge: "Image must be 1MB or smaller.",
    sentToast: (sent: number, total: number) => `Notification sent to ${sent} of ${total} devices.`,
    partialToast: (sent: number, failed: number) => `Partially delivered: ${sent} sent, ${failed} failed.`,
    failedToast: "Notification saved, but delivery failed.",
    processingToast: "Notification is being sent.",
    sendErrorToast: "Failed to send notification. Please try again.",
  },
  notificationView: {
    pageTitle: "Notification",
    backToListing: "Back to listing",
    descriptionLabel: "Description",
    audienceLabel: "Audience",
    typeLabel: "Type",
    createdByLabel: "Created By",
    createdDateLabel: "Created Date",
    sentDateLabel: "Sent Date",
    usersMatchedLabel: "Users Matched",
    sentLabel: "Sent",
    failedLabel: "Failed",
    imageLabel: "Image",
    imageUnavailable: "Image unavailable.",
    deleteButton: "Delete",
    notFoundTitle: "Notification not found",
    notFoundDescription: "It may have been deleted.",
    deleteModalTitle: "Delete notification?",
    deleteModalDescription: "This will permanently delete the notification and its image.",
    deleteConfirmLabel: "Delete",
    deleteSuccessToast: "Notification deleted.",
    deleteFileWarningToast: "Notification deleted, but the image could not be removed.",
    deleteErrorToast: "Something went wrong. Please try again.",
  },
};
