import { Router, Request, Response, NextFunction } from "express";
import Controller from "../../utils/interfaces/controller.interface";
import HttpException from "../../utils/exceptions/http.exception";
import validationMiddleware from "../../middleware/validation.middleware";
import postValidation from "./post.validation";
import PostService from "./post.service";

class PostController implements Controller {
    public path = '/posts';
    public router = Router();
    private PostService = new PostService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}`,
            validationMiddleware(postValidation.create),
            this.create
        );
    }

    private create = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { title, body } = req.body;
            const post = await this.PostService.create(title, body);
            console.log('in controller create'); //!
            res.status(201).json({ post });
        } catch (e) {
            next(new HttpException(400, 'Cannot create post'));
        }
    }
}

export default PostController;