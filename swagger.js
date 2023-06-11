const swaggerAutogen = require('swagger-autogen')({ language: 'ko' });

const doc = {
    info: {
      title: "Jangbogo API",
      description: "Description",
    },
    host: "http://3.34.24.220",
    schemes: ["http"],
    // schemes: ["https" ,"http"],
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
      },
    },
    security: [{
      bearerAuth: [], //authorize버튼을 클릭하면 입력필드가 생성됨
    }]
  };
  
  const outputFile = "./swagger-output.json";	// 같은 위치에 swagger-output.json을 만든다.
  const endpointsFiles = [
    "./app.js"					// 라우터가 명시된 곳을 지정해준다.
  ];
  
  swaggerAutogen(outputFile, endpointsFiles, doc);