import Avatar from '../models/Avatar';
import User from '../models/User';

class AvatarController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const avatarExists = await Avatar.findOne({
      where: {
        user_id: req.userId,
      },
    });
    if (avatarExists) {
      await avatarExists.update({ name, path });
      return res.json({ message: 'Avatar updated!' });
    } else {
      await Avatar.create({
        name,
        path,
        user_id: req.userId,
      });
      return res.json({ message: 'Avatar created!' });
    }
  }
}

export default new AvatarController();

// yarn sequelize migration:create --name=create-files
// yarn sequelize db:migrate
// yarn sequelize migration:create --name=add-avatar-field-to-users
