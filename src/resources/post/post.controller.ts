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
        this.router.route(`${this.path}`)
            .get(this.renderPosts)
            .post(validationMiddleware(postValidation.create),this.createPost)

        this.router.route(`${this.path}/new`)
            .get(this.renderFormNew)

        this.router.route(`${this.path}/:id`)
            .get(this.renderPost)
            .delete(this.deletePost)
            .put(validationMiddleware(postValidation.create),this.updatePost)

        this.router.route(`${this.path}/:id/edit`)
            .get(this.renderFormEdit)
    }

    private renderPost = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {   
            const postId = req.params.id;
            const post = await this.PostService.read(postId);
            res.render('posts/post', { post })
        } catch (e) {
            next(new HttpException(400, 'Cannot find post'));
        }
    }

    private renderPosts = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {   
            const posts = await this.PostService.readAll();
            res.render('posts/index', { posts });
        } catch (e) {
            next(new HttpException(400, 'Cannot find posts'));
        }
    }

    private renderFormNew = (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        try {
            res.render('posts/new');   
        } catch (e) {
            next(e);
        }
    }

    private renderFormEdit = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const postId = req.params.id;
            const post = await this.PostService.read(postId);
            res.render('posts/edit', { post });   
        } catch (e) {
            next(e);
        }
    }

    private createPost = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { title, body } = req.body;
            const post = await this.PostService.create(title, body);
            res.redirect(`/posts/${post._id}`);
        } catch (e) {
            next(new HttpException(400, 'Cannot create post'));
        }
    }

    private updatePost = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const postId = req.params.id;
            const content = req.body;
            const updatedPost = await this.PostService.update(postId, content);
            if (updatedPost) return res.redirect(`/posts/${updatedPost._id}`);
            res.redirect('/posts');
        } catch (error) {
            next(new HttpException(400, 'Cannot update post'));
        }
    }

    private deletePost = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const postId = req.params.id;
            const deletedPost = await this.PostService.delete(postId);
            console.log(`Post: "${deletedPost ? deletedPost.title : 'NULL'}" - is deleted`)
            res.redirect('/posts');
        } catch (e) {
            next(new HttpException(400, 'Cannot delete post'));
        }
    }
}

export default PostController;