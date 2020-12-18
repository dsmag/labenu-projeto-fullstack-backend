import { Request, Response } from "express";
import imageBusiness, { ImageBusiness } from "../business/ImageBusiness";
import { BaseDatabase } from "../data/BaseDatabase";
import { ImageInputDTO } from "../model/Image";

export class ImageController {
    constructor(
        private imageBusiness: ImageBusiness
    ){}

    public createImage = async (req: Request, res: Response) => {
        try {
            const { subtitle, file, tags, collection } = req.body
            
            const input: ImageInputDTO = {
                subtitle,
                file,
                tags,
                collection
            }

            const token = req.headers.authorization as string

            await this.imageBusiness.createImage(
                token,
                input
            )

            res.status(200).end()
        } catch (error) {
            res.status(400).send({ error: error.message });
        } finally {
            await BaseDatabase.destroyConnection();
        }
    }

    public getAllImagesByUser = async (req: Request, res: Response) => {
        try {            
            const token = req.headers.authorization as string

            const allImages = await this.imageBusiness.getAllImagesByUser(
                token    
            )

            res.status(200).send({ allImages })
        } catch (error) {
            res.status(400).send({ error: error.message });
        } finally {
            await BaseDatabase.destroyConnection();
        }
    }

    public getImageById = async (req: Request, res: Response) => {
        try {
            const imageId = req.params.id as string

            const token = req.headers.authorization as string

            const image = await this.imageBusiness.getImageById(
                token,
                imageId    
            )

            res.status(200).send({ image })
        } catch (error) {
            res.status(400).send({ error: error.message });
        } finally {
            await BaseDatabase.destroyConnection();
        }
    }
}

export default new ImageController(imageBusiness)