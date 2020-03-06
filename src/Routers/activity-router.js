const express = require('express');
const activityRouter = express.Router();
const logger = require('../logger');
const bodyParser = express.json();
const ActivityService = require('../Services/ActivityService');

activityRouter.route('/').get((req, res, next) => {
  const knexInstance = req.app.get('db');
  ActivityService.getAllActivities(knexInstance)
    .then(listings => {
      res.json(listings);
    })
    .catch(next);
});
activityRouter.route('/:id').delete((req, res, next) => {
  const knexInstance = req.app.get('db');
  const { id } = req.params;
  ActivityService.deleteActivity(knexInstance, id)
    .then(activity => {
      if (activity === -1) {
        logger.error(`Activity with id ${id} not found`);
        return res.status(404).send('Activity not found');
      }
      logger.info(`Activity with id ${id} has been deleted`);
      res
        .status(204)
        .json(`Activity ${id} has been successfully deleted`)
        .end();
    })
    .catch(next);
});

activityRouter.route('/').post(bodyParser, (req, res, next) => {
  const { Title, Date_Created, Creator, Description } = req.body;

  if (!Title) {
    logger.error('Title is required');
    return res.status(400).send('Title required');
  }
  if (!Description) {
    logger.error('Descriptione is required');
    return res.status(400).send('Description required');
  }
  if (!Creator) {
    logger.error('Creator is required');
    return res.status(400).send('Creator required');
  }
  if (!Date_Created) {
    logger.error('Date created is required');
    return res.status(400).send('Date created required');
  }

  const activity = {
    title: Title,
    date_created: Date_Created,
    creator: Creator,
    description: Description
  };

  const knexInstance = req.app.get('db');

  ActivityService.insertActivity(knexInstance, activity)
    .then(activity => {
      const { id } = activity;
      logger.info(`Activity with id of ${id} was created`);
      res.status(201).json(ActivityService.serializeActivity(activity));
    })
    .catch(next);
});

module.exports = activityRouter;
