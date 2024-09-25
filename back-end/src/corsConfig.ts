import cors from 'cors';

const whitelist: string[] = [
    'http://localhost:13000',
    '*'
];

const corsOptions: cors.CorsOptions = {
    origin: (origin,callback) => {
        if (whitelist.indexOf(origin!) !== -1 || !origin) {
            callback(null,true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};

export default corsOptions;  