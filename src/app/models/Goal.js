import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

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
}

export default Goal;
