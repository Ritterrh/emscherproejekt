const express = require("express");
const router = express.Router();

router.get("/changelog", async (req, res) => {
  res.json({
    updates: {
      1: {
        de_DE: [
          {
            title: "Erstes Update",
            description: "Initial release",
            date: "2019-01-01",
            version: "1.0.0",
            add: ["All additions"],
            change: ["Alle Änderungen"],
            remove: ["Alle Entfernungen"],
            fixed: ["Alle Fixes"],
          },
        ],
        en_US: [
          {
            title: "Ebglisch",
            description: "Initial release",
            date: "2019-01-01",
            version: "1.0.0",
            add: ["All additions"],
            change: ["Alle Änderungen"],
            remove: ["Alle Entfernungen"],
            fixed: ["Alle Fixes"],
          },
        ],
        ru_RU: [
          {
            title: "rzussisch",
            description: "Initial release",
            date: "2019-01-01",
            version: "1.0.0",
            add: ["All additions"],
            change: ["Alle Änderungen"],
            remove: ["Alle Entfernungen"],
            fixed: ["Alle Fixes"],
          },
        ],
        tr_TR: [
          {
            title: "tr",
            description: "Initial release",
            date: "2019-01-01",
            version: "1.0.0",
            add: ["All additions"],
            change: ["Alle Änderungen"],
            remove: ["Alle Entfernungen"],
            fixed: ["Alle Fixes"],
          },
        ],
        uk_UA: [
          {
            title: "Erstes Update",
            description: "Initial release",
            date: "2019-01-01",
            version: "1.0.0",
            add: ["All additions"],
            change: ["Alle Änderungen"],
            remove: ["Alle Entfernungen"],
            fixed: ["Alle Fixes"],
          },
        ],
        fr_FR: [
          {
            title: "Erstes Update",
            description: "Initial release",
            date: "2019-01-01",
            version: "1.0.0",
            add: ["All additions"],
            change: ["Alle Änderungen"],
            remove: ["Alle Entfernungen"],
            fixed: ["Alle Fixes"],
          },
        ],
        ar_AR: [
          {
            title: "Erstes Update",
            description: "Initial release",
            date: "2019-01-01",
            version: "1.0.0",
            add: ["All additions"],
            change: ["Alle Änderungen"],
            remove: ["Alle Entfernungen"],
            fixed: ["Alle Fixes"],
          },
        ],
      },
      2: {
        de_DE: [
          {
            title: "Erstes Update",
            description: "Initial release",
            date: "2019-01-01",
            version: "1.0.0",
            add: ["All additions"],
            change: ["Alle Änderungen"],
            remove: ["Alle Entfernungen"],
            fixed: ["Alle Fixes"],
          },
        ],
        en_US: [
          {
            title: "Erstes Update",
            description: "Initial release",
            date: "2019-01-01",
            version: "1.0.0",
            add: ["All additions"],
            change: ["Alle Änderungen"],
            remove: ["Alle Entfernungen"],
            fixed: ["Alle Fixes"],
          },
        ],
        ru_RU: [
          {
            title: "Erstes Update",
            description: "Initial release",
            date: "2019-01-01",
            version: "1.0.0",
            add: ["All additions"],
            change: ["Alle Änderungen"],
            remove: ["Alle Entfernungen"],
            fixed: ["Alle Fixes"],
          },
        ],
        tr_TR: [
          {
            title: "Erstes Update",
            description: "Initial release",
            date: "2019-01-01",
            version: "1.0.0",
            add: ["All additions"],
            change: ["Alle Änderungen"],
            remove: ["Alle Entfernungen"],
            fixed: ["Alle Fixes"],
          },
        ],
        uk_UA: [
          {
            title: "Erstes Update",
            description: "Initial release",
            date: "2019-01-01",
            version: "1.0.0",
            add: ["All additions"],
            change: ["Alle Änderungen"],
            remove: ["Alle Entfernungen"],
            fixed: ["Alle Fixes"],
          },
        ],
        fr_FR: [
          {
            title: "Erstes Update",
            description: "Initial release",
            date: "2019-01-01",
            version: "1.0.0",
            add: ["All additions"],
            change: ["Alle Änderungen"],
            remove: ["Alle Entfernungen"],
            fixed: ["Alle Fixes"],
          },
        ],
        ar_AR: [
          {
            title: "Erstes Update",
            description: "Initial release",
            date: "2019-01-01",
            version: "1.0.0",
            add: ["All additions"],
            change: ["Alle Änderungen"],
            remove: ["Alle Entfernungen"],
            fixed: ["Alle Fixes"],
          },
        ],
      },
    },
  });
});

module.exports = router;
