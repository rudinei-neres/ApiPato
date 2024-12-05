
import ConexaoMySql from '../utils/bancoDeDados.js'; // Certifique-se de que o caminho e o nome estão corretos

const UsuarioServico = {
  // Obtém um usuário pelo email
  async obterUsuario(email) {
    const [usuario] = await ConexaoMySql.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    return usuario[0] || null;
  },

  // Obtém um usuário pelo ID
  async obterUsuarioPorId(id) {
    const [usuario] = await ConexaoMySql.execute(
      "SELECT * FROM usuarios WHERE id_usuario = ?",
      [id]
    );
    return usuario[0] || null;
  },

  // Atualiza o saldo do usuário
  async atualizarSaldo(email, novoSaldo) {
    await ConexaoMySql.execute(
      "UPDATE usuarios SET carteira = ? WHERE email = ?",
      [novoSaldo, email]
    );
    return { mensagem: 'Saldo atualizado com sucesso.' };
  },
  
  async inicialSaldo(email) {
    const [resultado] = await ConexaoMySql.execute(
      "SELECT carteira FROM usuarios WHERE email = ?",
      [email]
    );
    return resultado[0] ? resultado[0].carteira : null;
  },
  

  // Deleta um usuário pelo ID
  async deletarUsuario(id) {
    await ConexaoMySql.execute(
      "DELETE FROM usuarios WHERE id_usuario = ?",
      [id]
    );
    return { mensagem: 'Usuário deletado com sucesso.' };
  },

  // Cria um novo usuário
  async criarUsuario({ nome, email, telefone, senha }) {
    console.log('Criando usuário no banco:', { nome, email, telefone });
    const query = 'INSERT INTO usuarios (nome, email, telefone, senha) VALUES (?, ?, ?, ?)';
    await ConexaoMySql.execute(query, [nome, email, telefone, senha]);
    return { mensagem: 'Usuário criado com sucesso.' };
  },
};

export default UsuarioServico; // Usando export default para exportar o serviço
