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
        this.router.get(
            `${this.path}/:id`,
            this.read
        )
        this.router.put(
            `${this.path}/:id`,
            validationMiddleware(postValidation.update),
            this.update
        );
        this.router.delete(
            `${this.path}/:id`,
            this.delete
        );
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { title, body } = req.body;
            const post = await this.PostService.create(title, body);
            res.status(201).json({ post });
        } catch (e) {
            next(new HttpException(400, 'Cannot create post'));
        }
    }

    private read = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {   
            const postId = req.params.id;
            const foundPost = await this.PostService.read(postId);
            res.status(200).json({ foundPost });
        } catch (e) {
            next(new HttpException(400, 'Cannot find post'));
        }
    }

    private update = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const postId = req.params.id;
            const content = req.body;
            const updatedPost = await this.PostService.update(postId, content);
            res.status(201).json({ updatedPost });
        } catch (error) {
            next(new HttpException(400, 'Cannot update post'));
        }
    }

    private delete = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const postId = req.params.id;
            const deletedPost = await this.PostService.delete(postId);
            res.status(204).json({ deletedPost });
        } catch (e) {
            next(new HttpException(400, 'Cannot delete post'));
        }
    }
}

export default PostController;