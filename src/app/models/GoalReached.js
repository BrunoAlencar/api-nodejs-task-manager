import Sequelize, { Model } from 'sequelize';

class GoalReached extends Model {
  static init(sequelize) {
    super.init(
      {
        value: Sequelize.INTEGER,
        note: Sequelize.STRING,
        is_done: Sequelize.BOOLEAN,
        subgoal_id: Sequelize.INTEGER,
        user_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
  }

  // static associate(models) {
  //   this.hasOne(models.Subgoal, {
  //     foreignKey: 'subgoal_id',
  //     as: 'goal_type',
  //   });
  // }
}

export default GoalReached;
