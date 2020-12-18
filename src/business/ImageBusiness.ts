import authenticator, {Authenticator, AuthenticationData} from "../services/Authenticator";
import idGenerator, { IdGenerator } from "../services/IdGenerator";
import imageDatabase, { ImageDatabase } from "../data/ImageDatabase";
import { ImageInputDTO, TagDTO, ImageTagsDTO, Image } from "../model/Image";
import { BaseError } from "../error/BaseError";

export class ImageBusiness {
    constructor(
        private authenticator: Authenticator,
        private idGenerator: IdGenerator,
        private imageDatabase: ImageDatabase
    ){}
    
    public createImage = async (accessToken: string, image: ImageInputDTO): Promise<void> => {
        try {
            const token: AuthenticationData = this.authenticator.getData(accessToken)

            if (!token) {
                throw new BaseError("Não autorizado", 401)
            }

            const idToken = token.id as string

            const nameToken = token.name as string

            const {subtitle, file, tags, collection} = image

            if(!subtitle || !file || !tags.length || !collection){
                throw new BaseError("Todos os campos são obrigatórios", 422)
            }
            
            const tagsDB: TagDTO[] = await this.imageDatabase.getTagByName(tags)

            const tagNames = tagsDB.map((tag: TagDTO) => {
                return tag.name
            })

            let newTags: TagDTO[] = []

            for (const tag of tags) {
                if (!tagNames.includes(tag.toLowerCase())) {
                    const tagId: string = this.idGenerator.generate();

                    const newTag: TagDTO = {
                        id: tagId,
                        name: tag.toLowerCase()
                    }

                    newTags.push(newTag)

                    await this.imageDatabase.createTag(newTag)
                }
            }

            const imageId: string = this.idGenerator.generate()

            const imageTags: ImageTagsDTO[] = [
                ...tagsDB,
                ...newTags
            ].map((item: TagDTO) => ({
                imageId,
                tagId: item.id
            }))

            await this.imageDatabase.createImage(
                Image.toImage({
                    id: imageId,
                    subtitle,
                    author_id: idToken,
                    file,
                    collection,
                    author_name: nameToken
                })
            )
            
            await this.imageDatabase.addTagImage(imageTags)
            
        } catch (error) {
            throw new BaseError(error.message, error.statusCode)
        }        
    }

    public getAllImagesByUser = async (accessToken: string): Promise<Image | Image[]> => {
        try {
            const token: AuthenticationData = this.authenticator.getData(accessToken)

            if (!token) {
                throw new BaseError("Não autorizado", 401)
            }

            const idToken = token.id as string

            const allImages: Image[] = await this.imageDatabase.getAllImagesByUser(idToken)

            for (const item of allImages) {
                const tags: string[] = await this.imageDatabase.getTagsByImageId(item.getId())

                item.setTags(tags)
            }

            return allImages
        } catch (error) {
            throw new BaseError(error.message, error.statusCode)
        }
    }

    public getImageById = async (accessToken: string, imageId: string): Promise<Image | undefined > => {
        try {
            const token: AuthenticationData = this.authenticator.getData(accessToken)

            if (!token) {
                throw new BaseError("Não autorizado", 401)
            }

            const image: Image = await this.imageDatabase.getImageById(imageId)

            if (!image) {
                throw new BaseError("Imagem não encontrada", 422)
            }           

            const tags: string[] = await this.imageDatabase.getTagsByImageId(imageId)
            
            image.setTags(tags)

            return image
        } catch (error) {
            throw new BaseError(error.message, error.statusCode)
        }
    }
}

export default new ImageBusiness( 
    authenticator,
    idGenerator,
    imageDatabase
)