/*
  Site settings. This is the only file you should need to edit.

  API_URL: paste your Google Apps Script web app URL here (ends in /exec).
           Until it's set, forms show a "not connected" message and the
           admin page can't save backgrounds.
*/
window.SITE_CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbxha-mo7yanjjb_kUo-bzSTOHo06F62LElR39A6IYUamohm0I14kb86IavWfGWPd_QYdQ/exec",

  QUIZ_URL: "https://pvanosdall.github.io/Oahu-Real-Estate-Quiz/",

  // Background photo for each page until you change it on the admin page.
  DEFAULT_BG: {
    home: "lanikai-sunrise",
    sell: "canal-sunset",
    about: "ridge",
    contact: "wave-lines",
    newsletter: "palm-frame"
  },

  // Photos available on the admin page (files live in img/photos/).
  PHOTOS: [
    "lanikai-sunrise", "rocks-sunrise", "palm-shadow-tall", "leaning-palm",
    "palm-frame", "clear-water", "palm-shadow-wide", "mountain-beach",
    "canal-sunset", "ridge", "wave-lines"
  ]
};
