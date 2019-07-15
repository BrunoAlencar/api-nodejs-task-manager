import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

class GoalType extends Model {
  static init(sequelize) {
    super.init(
      {
        type: Sequelize.STRING,
        value: Sequelize.INTEGER,
        user_id: Sequelize.INTEGER,
        goal_id: Sequelize.INTEGER,
        subgoal_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
  }
}

export default GoalType;
