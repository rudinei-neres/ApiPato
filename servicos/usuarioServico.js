import Usuario from '../modelos/usuarioModelo.js'; // Usando import para importar o modelo de usuário

const UsuarioServico = {
  async obterUsuario(email) {
    return await Usuario.buscarPorEmail(email);
  },
  async atualizarSaldo(email, novoSaldo) {
    return await Usuario.atualizarSaldo(email, novoSaldo);
  },
  async deletarUsuario(id) {
    return await Usuario.deletarUsuario(id);
  },
  async criarUsuario({ nome, email, telefone, senha }) {
    const query = 'INSERT INTO usuarios (nome, email, telefone, senha) VALUES (?, ?, ?, ?)';
    await db.query(query, [nome, email, telefone, senha]);
  }
  


};

export default UsuarioServico; // Usando export default para exportar o serviço
