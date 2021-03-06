import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import Goal from '../app/models/Goal';
import Subgoal from '../app/models/Subgoal';
import GoalType from '../app/models/GoalType';
import GoalReached from '../app/models/GoalReached';
import Avatar from '../app/models/Avatar';

const models = [User, Goal, GoalType, Subgoal, GoalReached, Avatar];

class Database {
  constructor() {
    this.init();
  }
  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
    models.map(
      model =>
        model && model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
