const express = require("express");
const activityRouter = express.Router();
const logger = require("../logger");
const bodyParser = express.json();
const ActivityService = require("../Services/ActivityService");
const requireAuth = require("../Auth/JWT");

activityRouter.route("/").get((req, res, next) => {
  const knexInstance = req.app.get("db");
  ActivityService.getAllActivities(knexInstance)
    .then((listings) => {
      res.json(listings);
    })
    .catch(next);
});
activityRouter.route("/:id").delete(requireAuth, (req, res, next) => {
  const knexInstance = req.app.get("db");
  const { id } = req.params;

  if ((req.user.id !== 1) | (req.user.id !== 3)) {
    res
      .status(401)
      .json({
        error: "Sorry, but your account isn't authorized to make this request",
      })
      .end();
  }

  ActivityService.deleteActivity(knexInstance, id)
    .then((activity) => {
      if (activity === -1) {
        logger.error(`Activity with id ${id} not found`);
        return res.status(404).send("Activity not found");
      }
      logger.info(`Activity with id ${id} has been deleted`);
      res
        .status(204)
        .json(`Activity ${id} has been successfully deleted`)
        .end();
    })
    .catch(next);
});

activityRouter.route("/").post(bodyParser, requireAuth, (req, res, next) => {
  const { title, date_created, creator, description } = req.body;

  for (const field of ["title", "date_created", "creator", "description"]) {
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`,
      });
  }

  const activity = {
    title,
    date_created,
    creator,
    description,
  };

  const knexInstance = req.app.get("db");

  ActivityService.insertActivity(knexInstance, activity)
    .then((activity) => {
      const { id } = activity;
      logger.info(`Activity with id of ${id} was created`);
      res.status(201).json(ActivityService.serializeActivity(activity));
    })
    .catch(next);
});

module.exports = activityRouter;
