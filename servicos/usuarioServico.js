import Usuario from '../modelos/usuarioModelo.js'; // Usando import para importar o modelo de usuário
import db from '../utils/bancoDeDados.js'; // Certifique-se de que o caminho e o nome estão corretos


const UsuarioServico = {

  async obterUsuario(email) {
    return await Usuario.buscarPorEmail(email);
  },
  async obterUsuario(email) {
    const connection = await new db().getConexao();
    const [usuario] = await connection.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    return usuario[0] || null;
  },

  async obterUsuarioPorId(id) {
    const connection = await new db().getConexao();
    const [usuario] = await connection.execute(
      "SELECT * FROM usuarios WHERE id_usuario = ?",
      [id]
    );
    return usuario[0] || null;
  },
  
  
  
  async atualizarSaldo(email, novoSaldo) {
    return await Usuario.atualizarSaldo(email, novoSaldo);
  },
  async deletarUsuario(id) {
    return await Usuario.deletarUsuario(id);
  },
  async criarUsuario({ nome, email, telefone, senha }) {
    console.log('Criando usuário no banco:', { nome, email, telefone });
    const query = 'INSERT INTO usuarios (nome, email, telefone, senha) VALUES (?, ?, ?, ?)';
    await db.query(query, [nome, email, telefone, senha]);
  }
  


};

export default UsuarioServico; // Usando export default para exportar o serviço
