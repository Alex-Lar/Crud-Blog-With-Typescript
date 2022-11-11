import express, { Application } from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';
import compression from 'compression';
import methodOverride from 'method-override'
import ErrorMiddleware from './middleware/error.middleware';
import Controller from './utils/interfaces/controller.interface';

class App {
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        this.initialiseDatabaseConnection();
        this.initialiseConfiguration();
        this.initialiseMiddleware();
        this.initialiseControllers(controllers);
        this.initialiseErrorHandling();
    }

    private initialiseConfiguration(): void {
        this.express.set('view engine', 'ejs');
        this.express.set('views', path.join(__dirname, 'views'));
    }

    private initialiseMiddleware(): void {
        this.express.use(express.static(path.join(__dirname, 'public')));
        this.express.use(methodOverride('_method'));
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());  
    }

    private initialiseControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/', controller.router);
        })
    }

    private initialiseErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }

    private initialiseDatabaseConnection(): void {
        const { MONGO_PATH } = process.env;
        mongoose.connect(`mongodb://${MONGO_PATH}/nodets-api`);

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, "connection error:"));
        db.once('open', () => {
            console.log("Database connected");
        });
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log('Port is listening...')
        });
    }
}

export default App;