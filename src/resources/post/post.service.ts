import postModel from "./post.model";
import Post from "./post.interface";

class PostService {
    private post = postModel;

    /*
     * Create a new post
     */
    public async create(title: string, body: string): Promise<Post> {
        try {
            return await this.post.create({title, body});
        } catch (e) {
            throw new Error('Unable to create post');
        }
    }

    /*
     * Find post by id
     */
    public async read(postId: string): Promise<Post | null> {
        try {
            return await this.post.findById(postId);
        } catch (e) {
            throw new Error('Unable to find post');
        }
    }

    /*
     * Find all posts
     */
    public async readAll(): Promise<Post[] | null> {
        try {
            return await this.post.find({});
        } catch (e) {
            throw new Error('Unable to find post');
        }
    }

    /*
     * Update post by id
     */
    public async update(postId: string, content: Post): Promise<Post | null> {
        try {
            return await this.post.findByIdAndUpdate(postId, { ...content });
        } catch (e) {
            throw new Error('Unable to update or find post');
        }
    }

    /*
     * Delete post by id
     */
    public async delete(postId: string): Promise<Post | null> {
        try {
            return await this.post.findByIdAndDelete(postId);
        } catch (e) {
            throw new Error('Unable to delete or find post');
        }
    }
}

export default PostService;