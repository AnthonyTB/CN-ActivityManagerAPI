const xss = require('xss');

const MarketplaceService = {
  getAllActivities(knex) {
    return knex('activities').select('*');
  },
  insertActivity(knex, newActivity) {
    return knex('activities')
      .insert(newActivity)
      .returning('*')
      .then(rows => rows[0]);
  },
  deleteActivity(knex, id) {
    return knex('activities')
      .where({ id })
      .delete();
  },
  serializeActivity(activity) {
    return {
      id: activity.id,
      Title: xss(activity.title),
      Creator: xss(activity.creator),
      Date_Created: new Date(activity.date_created),
      Description: xss(activity.description)
    };
  }
};

module.exports = MarketplaceService;
