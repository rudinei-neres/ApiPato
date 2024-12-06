import ConexaoMySql from '../utils/bancoDeDados.js'; // Certifique-se de que o caminho e o nome estão corretos

const Ofertaservico = {
  // Atualiza uma oferta pelo ID
  async atualizarOferta(id, { titulo, descricao, preco, validade }) {
    await ConexaoMySql.execute(
      'UPDATE ofertas SET titulo = ?, descricao = ?, preco = ?, validade = ? WHERE id_oferta = ?',
      [titulo, descricao, preco, validade, id]
    );
    return { mensagem: 'Oferta atualizada com sucesso.' };
  }
};

export default Ofertaservico;