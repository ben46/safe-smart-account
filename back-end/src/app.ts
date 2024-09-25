import express,{ Request,Response } from 'express';
import { swaggerUi,specs } from './swagger';  
import { sigRouter } from './routes/sigRouterMock';
// import { calldataRouter } from './routes/calldataRouter';
import { calldataRouter } from './routes/calldataRouterMock';

import cors from 'cors';  

const app = express();
const port = 13000;

const corsOptions: cors.CorsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};  

app.use(cors(corsOptions));  

app.use('/api',sigRouter);
app.use('/api',calldataRouter);

app.use(express.json());

app.use('/swagger',swaggerUi.serve,swaggerUi.setup(specs));  

app.get('/',(req: Request,res: Response) => {
    res.send('localhost/swagger to visit swagger page');
});

app.listen(port,() => {
    console.log(`Server is running on http://localhost:${port}`);
});