const Usuario = require('../modelos/usuarioModelo');

const UsuarioServico = {
  async obterUsuario(email) {
    return await Usuario.buscarPorEmail(email);
  },
  async atualizarSaldo(email, novoSaldo) {
    return await Usuario.atualizarSaldo(email, novoSaldo);
  },
  async deletarUsuario(id) {
    return await Usuario.deletarUsuario(id);
  }
};

module.exports = UsuarioServico;
