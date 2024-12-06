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
  },

  // Método para obter uma compra por ID
  async obterCompra(req, res) {
    const { id } = req.params;

    try {
      const [compra] = await ConexaoMySql.execute(
        "SELECT * FROM compras WHERE id_compra = ?",
        [id]
      );

      if (compra.length === 0) {
        return res.status(404).json({ mensagem: 'Compra não encontrada.' });
      }

      res.status(200).json(compra[0]);
    } catch (error) {
      console.error('Erro ao obter compra:', error);
      res.status(500).json({ mensagem: 'Erro ao obter compra.' });
    }
  },

  // Método para atualizar uma compra por ID
  async atualizarCompra(req, res) {
    const { id } = req.params;
    const { usuario_id, oferta_id } = req.body;

    try {
      await ConexaoMySql.execute(
        "UPDATE compras SET usuario_id = ?, oferta_id = ? WHERE id_compra = ?",
        [usuario_id, oferta_id, id]
      );

      res.status(200).json({ mensagem: 'Compra atualizada com sucesso!' });
    } catch (error) {
      console.error('Erro ao atualizar compra:', error);
      res.status(500).json({ mensagem: 'Erro ao atualizar compra.' });
    }
  },

  // Método para deletar uma compra por ID
  async deletarCompra(req, res) {
    const { id } = req.params;

    try {
      const [resultado] = await ConexaoMySql.execute(
        "DELETE FROM compras WHERE id_compra = ?",
        [id]
      );

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ mensagem: 'Compra não encontrada.' });
      }

      res.status(200).json({ mensagem: 'Compra deletada com sucesso.' });
    } catch (error) {
      console.error('Erro ao deletar compra:', error);
      res.status(500).json({ mensagem: 'Erro ao deletar compra.' });
    }
  },

  async  listarusCompras (req, res) {
    try {
      const [compras] = await ConexaoMySql.execute('SELECT * FROM compras');
  
      if (ofertas.length === 0) {
        return res.status(404).json({ mensagem: 'Nenhuma compras encontrada.' });
      }
  
      res.status(200).json(ofertas);
    } catch (error) {
      console.error('Erro ao listar compras:', error);
      res.status(500).json({ mensagem: 'Erro ao listar compras.' });
    }
  
  }



};

export default ComprasControlador;

