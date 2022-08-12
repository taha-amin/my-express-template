const { Router } = require('express');
const Item = require('../models/Item');
const authorizeItem = require('../middleware/authorizeItem');

module.exports = Router()
  .param('id', (req, res, next, id) => {
    req.id = id;
    next();
  })

  .post('/', async ({ body, user }, res, next) => {
    try {
      const item = await Item.insert({ ...body, user_id: user.id });
      res.json(item);
    } catch (e) {
      next(e);
    }
  })

  .get('/:id', authorizeItem, async ({ id }, res, next) => {
    try {
      const item = await Item.getById(id);
      res.json(item);
    } catch (e) {
      next(e);
    }
  })

  .get('/', async ({ user }, res, next) => {
    try {
      const items = await Item.getAll(user.id);
      res.json(items);
    } catch (e) {
      next(e);
    }
  })

  .put('/:id', authorizeItem, async ({ id, user, body }, res, next) => {
    try {
      const item = await Item.updateById(id, user.id, body);
      res.json(item);
    } catch (e) {
      next(e);
    }
  })

  .delete('/:id', authorizeItem, async ({ id }, res, next) => {
    try {
      const item = await Item.delete(id);
      res.json(item);
    } catch (e) {
      next(e);
    }
  });
