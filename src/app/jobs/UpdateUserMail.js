import Mail from '../../lib/Mail';

class UpdateUserMail {
  get key() {
    return 'UpdateUserMail';
  }

  async handle({ data }) {
    const { user } = data;

    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Atualização de dados!',
      template: 'updateuser',
      context: {
        name: user.name,
        email: user.email,
      },
    });
  }
}

export default new UpdateUserMail();
