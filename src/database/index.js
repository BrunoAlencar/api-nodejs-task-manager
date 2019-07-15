import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import Goal from '../app/models/Goal';
import GoalType from '../app/models/GoalType';

const models = [User, Goal, GoalType];

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
