import UsuarioServico from '../servicos/usuarioServico.js';

const UsuarioControlador = {
  async login(req, res, next) {
    // Lógica para login
  },
  async obterUsuario(req, res, next) {
    const email = req.query.email;  // Exemplo de como você pode buscar por email
    const usuario = await UsuarioServico.obterUsuario(email);
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
  },
  async atualizarSaldo(req, res, next) {
    const { email, saldo } = req.body;
    await UsuarioServico.atualizarSaldo(email, saldo);
    res.status(200).json({ mensagem: 'Saldo atualizado com sucesso' });
  },
  async deletarUsuario(req, res, next) {
    const { id } = req.params;
    await UsuarioServico.deletarUsuario(id);
    res.status(200).json({ mensagem: 'Usuário deletado com sucesso' });
  }
};

export default UsuarioControlador;

