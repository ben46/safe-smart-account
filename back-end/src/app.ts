import express,{ Request,Response } from 'express';
import { userRouter } from './routes/userRouter';
import { swaggerUi,specs } from './swagger';  

const app = express();
const port = 3000;
app.use('/api',userRouter);

app.use(express.json());


// 添加 Swagger UI  
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(specs));  
app.use('/users',userRouter);  

app.get('/',(req: Request,res: Response) => {
    res.send('Hello World!');
});

app.listen(port,() => {
    console.log(`Server is running on http://localhost:${port}`);
});