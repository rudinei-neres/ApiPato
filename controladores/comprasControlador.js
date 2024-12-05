import ConexaoMySql from '../utils/bancoDeDados.js';

const ComprasControlador = {
  // Método para buscar compras de um usuário
  async buscarCompras(req, res) {
    const { id_usuario } = req.params;

    if (!id_usuario) {
      return res.status(400).json({ error: "ID do usuário é obrigatório." });
    }

    try {
      const connection = await new ConexaoMySql().getConexao();
      const [compras] = await connection.execute(
        "SELECT * FROM compras WHERE id_usuario = ?",
        [id_usuario]
      );

      if (compras.length === 0) {
        return res.status(200).json([]); // Retorna lista vazia ao invés de 404
      }

      res.status(200).json(compras);
    } catch (error) {
      console.error("Erro ao buscar compras:", error);
      res.status(500).json({ error: "Erro ao buscar compras." });
    }
  }
};

export default ComprasControlador;

