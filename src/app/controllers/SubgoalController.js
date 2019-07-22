import * as Yup from 'yup';

import User from '../models/User';
import Subgoal from '../models/Subgoal';
import GoalType from '../models/GoalType';

class SubgoaloalController {
  async index(req, res) {
    const subgoals = await Subgoal.findAll({
      where: { user_id: req.userId, goal_id: req.params.idgoal },
      order: [['createdAt', 'desc']],
      include: [
        {
          model: GoalType,
          as: 'goal_type',
          attributes: ['id', 'type', 'value'],
        },
      ],
    });

    return res.json(subgoals);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string(),
      week_days: Yup.string().required(),
      value: Yup.number().required(),
      type: Yup.string().required(),
      goal_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { title, description, week_days, type, value, goal_id } = req.body;
    let subgoal = {
      user_id: req.userId,
      title,
      description,
      week_days,
      goal_id,
    };
    subgoal = await Subgoal.create(subgoal);

    let goalType = {
      user_id: req.userId,
      subgoal_id: subgoal.id,
      type,
      value,
    };

    goalType = await GoalType.create(goalType);

    return res.json({
      subgoal,
      goalType,
    });
  }
  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      week_days: Yup.string(),
      value: Yup.number(),
      type: Yup.string(),
      is_active: Yup.boolean(),
      subgoal_id: Yup.number().required(),
      goal_type_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      title,
      description,
      week_days,
      type,
      value,
      is_active,
      goal_type_id,
      subgoal_id,
    } = req.body;

    let subgoal = {
      title,
      description,
      week_days,
      is_active,
    };
    const subgoalExists = await Subgoal.findByPk(subgoal_id);
    if (!subgoalExists) {
      return res.status(400).json({ error: 'Subgoal does not exists' });
    }
    subgoal = await subgoalExists.update(subgoal);

    let goalType = {
      user_id: req.userId,
      subgoal_id: subgoal.id,
      type,
      value,
    };
    const goalTypeExists = await GoalType.findByPk(goal_type_id);
    if (!goalTypeExists) {
      return res.status(400).json({ error: 'Goal type does not exists' });
    }
    goalType = await goalTypeExists.update(goalType);

    return res.json({
      subgoal,
      goalType,
    });
  }

  getTypes(req, res){
    const types = [
      'hours_per_day',
      'pages_per_day',
      'money_per_month'
    ]
    res.json(types)
  }
}

export default new SubgoaloalController();
