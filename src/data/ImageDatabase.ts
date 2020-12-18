import { BaseDatabase } from "./BaseDatabase";
import { Image, TagDTO, ImageTagsDTO } from "../model/Image";

export class ImageDatabase extends BaseDatabase {
    
    public async createTag(
        tag: TagDTO
    ): Promise<void> {
        try {
            await this.getConnection()
                .insert({
                    id: tag.id,
                    name: tag.name
                })
                .into(this.tableNames.tags);
        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    public async getTagByName(
        tags: string[]
    ): Promise<TagDTO[]> {
        try {
            const result = await this.getConnection()
            .select("*")
            .from(this.tableNames.tags)
            .whereIn('name', tags)

            return result
        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }
    
    public async addTagImage(
        tagImage: ImageTagsDTO[]
    ): Promise<void> {
        try {
            await this.getConnection()
            .insert(tagImage.map((item: ImageTagsDTO) => ({
                image_id: item.imageId,
                tag_id: item.tagId
            })))
            .into(this.tableNames.imageTags)
            
        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    public async createImage(
        image: Image
    ): Promise<void> {
        try {
            await this.getConnection()
                .insert({
                    id: image.getId(),
                    subtitle: image.getSubtitle(),
                    author_id: image.getAuthorId(),
                    file: image.getFile(),
                    collection: image.getCollection(),
                    author_name: image.getAuthorName()
                })
                .into(this.tableNames.images);
        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    public async getTagsByImageId(
        imageId: string
    ): Promise<string[]> {
        try {
            const result = await this.getConnection()
                .select("t.name")
                .from(`${this.tableNames.imageTags} as it`)
                .join(
                    `${this.tableNames.tags} as t`,
                    "it.tag_id",
                    "t.id"
                )
                .where("it.image_id", imageId)

            return result.map(tag => tag.name)
        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    public async getAllImagesByUser(
        authorId: string
    ): Promise<Image[]> {
        try {
            const result = await this.getConnection()
                .select("i.*", "u.name")
                .from(`${this.tableNames.images} as i`)
                .join(
                    `${this.tableNames.users} as u`,
                    "i.author_id",
                    "u.id"
                )
                .where("i.author_id", authorId)
                .orderBy("i.created_at", "desc")

            return result.map((image: any) => Image.toImage(image))
        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    public async getImageById(
        imageId: string
    ): Promise<Image> {
        try {
            const result = await this.getConnection()
                .select("i.*", "u.name")
                .from(`${this.tableNames.images} as i`)
                .join(
                    `${this.tableNames.users} as u`,
                    "i.author_id",
                    "u.id"
                )
                .where("i.id", imageId)

            return Image.toImage(result[0])
        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }
}

export default new ImageDatabase()