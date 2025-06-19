require('dotenv').config();
const { App } = require('./app');

async function iniciarServidor() {
  try {
    const app = new App();
    await app.initialize();
    
    const PUERTO = process.env.PORT || 3000;
    const HOST = process.env.HOST || '0.0.0.0';
    
    const servidor = app.getApp().listen(PUERTO, HOST, () => {
      console.log(`🚀 Servidor ejecutándose en http://${HOST}:${PUERTO}`);
      console.log(`📚 Documentación API: http://${HOST}:${PUERTO}/api`);
      console.log(`❤️  Verificación de Salud: http://${HOST}:${PUERTO}/health`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    });

    // Cierre elegante
    const cierreElegante = (señal) => {
      console.log(`\n📋 Recibida señal ${señal}. Iniciando cierre elegante...`);
      
      servidor.close(() => {
        console.log('✅ Servidor HTTP cerrado.');
        
        // Cerrar conexión a base de datos
        app.close();
        console.log('✅ Conexión a base de datos cerrada.');
        
        process.exit(0);
      });

      // Forzar cierre después de 10 segundos
      setTimeout(() => {
        console.error('❌ No se pudieron cerrar las conexiones a tiempo, cerrando forzadamente');
        process.exit(1);
      }, 10000);
    };

    // Escuchar señales de cierre
    process.on('SIGTERM', () => cierreElegante('SIGTERM'));
    process.on('SIGINT', () => cierreElegante('SIGINT'));

    // Manejar excepciones no capturadas
    process.on('uncaughtException', (err) => {
      console.error('❌ Excepción No Capturada:', err);
      cierreElegante('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Promesa Rechazada No Manejada en:', promise, 'razón:', reason);
      cierreElegante('unhandledRejection');
    });

  } catch (error) {
    console.error('❌ Fallo al iniciar servidor:', error);
    process.exit(1);
  }
}

// Solo iniciar servidor si este archivo se ejecuta directamente
if (require.main === module) {
  iniciarServidor();
}

module.exports = { iniciarServidor };