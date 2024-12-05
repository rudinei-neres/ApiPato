import ConexaoMySql from '../utils/bancoDeDados.js';

const ComprasControlador = {
  // Método para buscar compras do usuário autenticado
  async buscarCompras(req, res) {
    const { id } = req.usuario; // Obter o ID do usuário autenticado do middleware

    if (!id) {
      return res.status(400).json({ error: "ID do usuário não encontrado na autenticação." });
    }

    try {
      const [compras] = await ConexaoMySql.execute(
        "SELECT * FROM compras WHERE usuario_id = ?",
        [id]
      );

      res.status(200).json(compras.length ? compras : []); // Retorna lista vazia se não houver compras
    } catch (error) {
      console.error("Erro ao buscar compras:", error);
      res.status(500).json({ error: "Erro ao buscar compras." });
    }
  },

  // Método para adicionar uma compra
  async adicionarCompras(req, res) {
    const { oferta_id } = req.body;
    const { id } = req.usuario; // Obter o ID do usuário autenticado do middleware

    if (!id || !oferta_id) {
      return res.status(400).json({ error: "Os campos usuario_id e oferta_id são obrigatórios." });
    }

    try {
      await ConexaoMySql.execute(
        "INSERT INTO compras (usuario_id, oferta_id) VALUES (?, ?)",
        [id, oferta_id]
      );

      res.status(201).json({ mensagem: "Compra adicionada com sucesso." });
    } catch (error) {
      console.error("Erro ao adicionar compra:", error);
      res.status(500).json({ error: "Erro ao adicionar compra." });
    }
  }
};

export default ComprasControlador;

