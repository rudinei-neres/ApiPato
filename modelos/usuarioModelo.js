const db = require('../utils/bancoDeDados');

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

module.exports = Usuario;
