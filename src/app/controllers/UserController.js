import * as Yup from 'yup';

import User from '../models/User';

import Mail from '../../lib/Mail';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res.status(400).json({ error: 'User alread existis' });
    }

    const { id, name, email, role } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      role,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string()
        .min(6)
        .when('password', (password, field) =>
          password ? field.required().oneOf([Yup.ref('password')]) : field
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({
        where: {
          email,
        },
      });

      if (userExists) {
        return res.status(400).json({ error: 'user already exists' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, role } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      role,
    });
  }

  async recover(req, res) {
    const { email } = req.body;

    const user = await User.findOne({
      where: {
        email
      }
    })

    if(!user){
      return res.status(404).json({error: 'Email not found'})
    }

    const newPassword = Math.random().toString(36).substring(6);

    await user.update({password: newPassword})

    Mail.sendMail({
      to: `${user.name} <${email}>`,
      subject: 'Recuperação de senha',
      template: 'recover',
      context: {
        user: user.name,
        newPassword
      },
    });
    res.json({message: 'Email enviado!'})
  }
}

export default new UserController();
