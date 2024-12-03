import db from '../utils/bancoDeDados'; // Usando import para importar o banco de dados

const Usuario = {
  async buscarPorEmail(email) {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0];
  },
  async atualizarSaldo(email, novoSaldo) {
    await db.query('UPDATE usuarios SET carteira = ? WHERE email = ?', [novoSaldo, email]);
  },
  async deletarUsuario(id) {
    await db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
  }
};

export default Usuario; // Usando export default para exportar o objeto Usuario
