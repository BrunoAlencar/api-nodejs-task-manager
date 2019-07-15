import Sequelize, { Model } from 'sequelize';

class Goal extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        deadline: Sequelize.DATE,
        user_id: Sequelize.INTEGER,
        color: Sequelize.STRING,
        completed: Sequelize.BOOLEAN,
        user_experience: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }
  static associate(models) {
    this.hasOne(models.GoalType, {
      foreignKey: 'goal_id',
      as: 'goal_type',
    });
  }
}

export default Goal;
