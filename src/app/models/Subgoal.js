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

  static associate(models) {
    this.hasOne(models.GoalType, {
      foreignKey: 'subgoal_id',
      as: 'goal_type',
    });
  }
}

export default Subgoal;
