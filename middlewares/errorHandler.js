const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      mensagem: err.message || 'Ocorreu um erro interno no servidor.'
    });
  };
  
  module.exports = errorHandler;
  