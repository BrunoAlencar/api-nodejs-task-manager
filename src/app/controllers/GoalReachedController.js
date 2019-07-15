import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import GoalReached from '../models/GoalReached';
import Subgoal from '../models/Subgoal';
import GoalType from '../models/GoalType';

class GoalReachedController {
  async store(req, res) {
    const goalReachedExists = await GoalReached.findOne({
      where: {
        user_id: req.userId,
        createdAt: {
          [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
        },
      },
    });
    // console.log(new Date(goalReachedExists.createdAt));
    // return res.json(goalReachedExists);

    if (goalReachedExists) {
      console.log('lista');
      const goals_reached = await GoalReached.findAll({
        where: { user_id: req.userId },
      });
      return res.json(goals_reached);
    }

    const subgoals = await Subgoal.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: GoalType,
          as: 'goal_type',
          attributes: ['id', 'value'],
        },
      ],
    });

    const goalReached = await GoalReached.bulkCreate(
      subgoals.map(subgoal => {
        return {
          value: subgoal.goal_type.value,
          subgoal_id: subgoal.id,
          user_id: req.userId,
        };
      })
    );
    console.log('cria');
    res.json(goalReached);
  }

  async index(req, res) {
    console.log('lista');
    const goals_reached = await GoalReached.findAll({
      where: { user_id: req.userId },
    });
    return res.json(goals_reached);
  }
}

export default new GoalReachedController();
