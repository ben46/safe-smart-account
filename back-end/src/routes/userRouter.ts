import { Router,Request,Response } from 'express';

const router = Router();

// router.get('/users',(req: Request,res: Response) => {
//     res.json({ message: 'List of users' });
// });
 

/**  
 * @swagger  
 * /users:  
 *   get:  
 *     summary: Retrieve a list of users  
 *     description: Retrieve a list of users from the database  
 *     responses:  
 *       200:  
 *         description: A list of users  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: array  
 *               items:  
 *                 type: object  
 *                 properties:  
 *                   id:  
 *                     type: integer  
 *                   name:  
 *                     type: string  
 */
router.get('/users',(req,res) => {
    // 实现获取用户列表的逻辑  
    res.json([{ id: 1,name: 'John Doe' }]);
});  


export { router as userRouter };  
