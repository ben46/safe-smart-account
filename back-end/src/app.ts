import express,{ Request,Response } from 'express';
import { swaggerUi,specs } from './swagger';  
import { sigRouter } from './routes/sigRouter';
const app = express();
const port = 3000;

app.use('/api',sigRouter);
app.use(express.json());

app.use('/swagger',swaggerUi.serve,swaggerUi.setup(specs));  

app.get('/',(req: Request,res: Response) => {
    res.send('localhost/swagger to visit swagger page');
});

app.listen(port,() => {
    console.log(`Server is running on http://localhost:${port}`);
});