import ConexaoMySql from '../utils/bancoDeDados.js'; // Certifique-se de que o caminho e o nome estão corretos

const ComprasServico = {
  // Deleta uma compra pelo ID
  async deletarCompra(id) {
    const [resultado] = await ConexaoMySql.execute(
      "DELETE FROM compras WHERE id_compra = ?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      throw new Error('Compra não encontrada.');
    }
    return { mensagem: 'Compra deletada com sucesso.' };
  },

  // Atualiza uma compra pelo ID
  async atualizarCompra(id, { usuario_id, oferta_id }) {
    await ConexaoMySql.execute(
      "UPDATE compras SET usuario_id = ?, oferta_id = ? WHERE id_compra = ?",
      [usuario_id, oferta_id, id]
    );
    return { mensagem: 'Compra atualizada com sucesso.' };
  },

  // Obtém uma compra pelo ID
  async obterCompra(id) {
    const [compra] = await ConexaoMySql.execute(
      "SELECT * FROM compras WHERE id_compra = ?",
      [id]
    );
    if (compra.length === 0) {
      throw new Error('Compra não encontrada.');
    }
    return compra[0];
  }
};

export default ComprasServico;
