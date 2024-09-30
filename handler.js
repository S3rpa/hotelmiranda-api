exports.app = async (event) => {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Función Lambda funcionando correctamente!' }),
    };
  };