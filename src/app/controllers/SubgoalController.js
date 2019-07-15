import * as Yup from 'yup';

import User from '../models/User';
import Subgoal from '../models/Subgoal';
import GoalType from '../models/GoalType';

class SubgoaloalController {
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
}

export default new SubgoaloalController();
