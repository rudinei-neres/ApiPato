import Usuario from '../modelos/usuarioModelo'; // Usando import para importar o modelo de usuário

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

export default UsuarioServico; // Usando export default para exportar o serviço
