import * as Yup from 'yup';

import User from '../models/User';
import Goal from '../models/Goal';
import GoalType from '../models/GoalType';

class GoalController {
  async index(req, res) {
    const goals = await Goal.findAll({
      where: { user_id: req.userId, completed: false },
      order: [['createdAt', 'desc']],
      include: [
        {
          model: GoalType,
          as: 'goal_type',
          attributes: ['id', 'type', 'value'],
        },
      ],
    });

    return res.json(goals);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string(),
      deadline: Yup.date().required(),
      value: Yup.number().required(),
      type: Yup.string().required(),
      color: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { title, description, deadline, color, type, value } = req.body;
    let goal = {
      user_id: req.userId,
      title,
      description,
      deadline,
      color,
    };
    goal = await Goal.create(goal);

    let goalType = {
      user_id: req.userId,
      goal_id: goal.id,
      type,
      value,
    };

    goalType = await GoalType.create(goalType);

    return res.json({
      goal,
      goalType,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      deadline: Yup.date(),
      value: Yup.number(),
      type: Yup.string(),
      color: Yup.string(),
      completed: Yup.boolean(),
      user_experience: Yup.string(),
      goal_id: Yup.number().required(),
      goal_type_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      title,
      description,
      deadline,
      color,
      type,
      value,
      completed,
      user_experience,
      goal_id,
      goal_type_id,
    } = req.body;

    let goal = {
      user_id: req.userId,
      title,
      description,
      deadline,
      color,
      completed,
      user_experience,
    };
    const goalExists = await Goal.findByPk(goal_id);
    if (!goalExists) {
      return res.status(400).json({ error: 'Goal does not exists' });
    }
    goal = await goalExists.update(goal);

    let goalType = {
      user_id: req.userId,
      goal_id: goal.id,
      type,
      value,
    };
    const goalTypeExists = await GoalType.findByPk(goal_type_id);
    if (!goalTypeExists) {
      return res.status(400).json({ error: 'Goal type does not exists' });
    }
    goalType = await goalTypeExists.update(goalType);

    return res.json({
      goal,
      goalType,
    });
  }
}

export default new GoalController();
