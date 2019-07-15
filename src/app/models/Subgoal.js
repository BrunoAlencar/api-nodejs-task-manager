import Sequelize, { Model } from 'sequelize';

class Subgoal extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        week_days: Sequelize.STRING,
        is_active: Sequelize.BOOLEAN,
        goal_id: Sequelize.INTEGER,
        user_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
  }
}

export default Subgoal;
