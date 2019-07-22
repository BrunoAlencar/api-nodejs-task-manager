import Sequelize, { Model } from 'sequelize';

class Avatar extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        user_id: Sequelize.INTEGER,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/avatars/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );
  }
}

export default Avatar;
