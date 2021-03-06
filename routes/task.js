const router = require('express').Router({ mergeParams: true });
const Task = require('../models/task');
const Sequelize = require('../models');
const moment = require('moment');
//Add a task
router.post('/:id/add-task', async (req, res) => {
  try {
    const taskName = req.body.name;
    const userId = req.params.id;

    const addTask = await Task.create({
      name: taskName,
      user_id: userId,
    });
    res.status(200).send(addTask);
  } catch (error) {
    console.error(error.message);
  }
});

//Start task
router.post('/start-task/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const startTime = moment().format();

    const startTask = await Task.findOne({
      where: {
        id: id,
      },
    });
    startTask.start_time = startTime;
    await startTask.save();
    res.status(200).send(startTask);
  } catch (error) {
    console.error(error.message);
  }
});

//End task
router.post('/end-task/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const endTime = moment().format();

    const endTask = await Task.findOne({
      where: {
        id: id,
      },
    });
    endTask.end_time = endTime;
    await endTask.save();

    //Task duration
    const taskDuration = await Sequelize.query(
      `UPDATE tasks SET task_duration = AGE(end_time,start_time) WHERE id=${id} RETURNING *`
    );

    res.status(200).send(taskDuration);
  } catch (error) {
    console.error(error.message);
  }
});

//Update task
router.post('/update-task/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const taskName = req.body.name;

    const updateTask = await Task.findOne({
      where: {
        id: id,
      },
    });

    updateTask.name = taskName;
    await updateTask.save();
    res.status(200).send(updateTask);
  } catch (error) {
    console.error(error.message);
  }
});

//Delete task
router.post('/delete-task/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const deleteTask = await Task.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).send('task deleted');
  } catch (error) {
    console.error(error.message);
  }
});

//List all tasks
router.get('/:id/list-tasks', async (req, res) => {
  try {
    const userId = req.params.id;
    const listTasks = await Task.findAll({
      where: {
        user_id: userId,
      },
    });

    res.status(200).send(listTasks);
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = router;
