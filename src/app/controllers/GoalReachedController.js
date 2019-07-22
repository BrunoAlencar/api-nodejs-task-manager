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

    if (goalReachedExists) {
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
    res.json(goalReached);
  }

  async index(req, res) {
    const goals_reached = await GoalReached.findAll({
      where: { user_id: req.userId, subgoal_id: req.params.subgoal_id },
    });
    return res.json(goals_reached);
  }

  async update(req, res) {
    const { value, is_done, note, id } = req.body;

    const goalReachedExists = await GoalReached.findByPk(id);
    if(!goalReachedExists){
      return res.status(400).json({error: 'Goal Reached does not exists'})
    }

    await goalReachedExists.update({value, is_done, note});

    return res.json({message: 'Goal Reached is updated!'})
  }

}

export default new GoalReachedController();
