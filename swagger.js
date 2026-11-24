const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Sistem Inventaris Sekolah',
      version: '1.0.0',
      description: 'Dokumentasi Backend API untuk Sistem Inventaris Sekolah',
    },
    servers: [
      {
        url: 'https://sistem-inventaris-sekolah-orpin.vercel.app',
        description: 'Production Server (Vercel)',
      },
      {
        url: 'http://localhost:5000',
        description: 'Development Server (Local)',
      },
    ],
  },
  apis: ['./route/*.js', './controller/*.js'], // Sesuaikan dengan path rute/controller kamu
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  // Gunakan setup dan serve secara terpisah agar kompatibel dengan serverless
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

module.exports = swaggerDocs;