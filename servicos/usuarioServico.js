
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
  // Método para atualizar o saldo do usuário pelo ID
async atualizarSaldoPorId(id, novoSaldo) {
  await ConexaoMySql.execute(
    "UPDATE usuarios SET carteira = ? WHERE id_usuario = ?",
    [novoSaldo, id]
  );
  return { mensagem: 'Saldo atualizado com sucesso.' };
},

// Método para obter o saldo do usuário pelo ID
async obterSaldoPorId(id) {
  const [result] = await ConexaoMySql.execute(
    "SELECT carteira FROM usuarios WHERE id_usuario = ?",
    [id]
  );
  return result.length ? result[0].carteira : null;
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
    
    // Modificando a consulta para incluir o valor inicial da carteira
    const query = 'INSERT INTO usuarios (nome, email, telefone, senha, carteira) VALUES (?, ?, ?, ?, ?)';
    const saldoInicial = 500; // Definindo o saldo inicial da carteira
  
    // Executando a consulta com o saldo inicial incluído
    await ConexaoMySql.execute(query, [nome, email, telefone, senha, saldoInicial]);
  
    return { mensagem: 'Usuário criado com sucesso.' };
  }
  
  
};

export default UsuarioServico; // Usando export default para exportar o serviço
