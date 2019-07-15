import * as Yup from 'yup';

import User from '../models/User';
import Goal from '../models/Goal';
import GoalType from '../models/GoalType';

class GoalController {
  async index(req, res) {
    const goals = await Goal.findAll({
      where: { user_id: req.userId },
      order: [['createdAt', 'desc']],
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
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string()
        .min(6)
        .when('password', (password, field) =>
          password ? field.required().oneOf([Yup.ref('password')]) : field
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({
        where: {
          email,
        },
      });

      if (userExists) {
        return res.status(400).json({ error: 'user already exists' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, role } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      role,
    });
  }
}

export default new GoalController();
