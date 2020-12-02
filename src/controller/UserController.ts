import { Request, Response } from "express";
import { UserInputDTO, LoginInputDTO } from "../model/User";
import userBusiness, { UserBusiness } from "../business/UserBusiness";
import { BaseDatabase } from "../data/BaseDatabase";

export class UserController {
    constructor(
        private userBusiness: UserBusiness
    ){}

    public signup = async (req: Request, res: Response) => {
        try {
            const {name, email, nickname, password } = req.body

            const input: UserInputDTO = {
                name,
                email,
                nickname,
                password
            }            

            const token = await this.userBusiness.createUser(input);
            
            res.status(200).send({ token });

        } catch (error) {
            res.status(400).send({ error: error.message });
        } finally {
            await BaseDatabase.destroyConnection();
        }     
    }

    public login = async (req: Request, res: Response) => {
        try {
            const {emailOrNickname, password} = req.body
            const input: LoginInputDTO = {
                emailOrNickname,
                password
            }

            const token = await this.userBusiness.getUserByEmailOrNickname(input);

            res.status(200).send( token );

        } catch (error) {
            res.status(400).send({ error: error.message });
        } finally {
            await BaseDatabase.destroyConnection();
        }
    }

}

export default new UserController(userBusiness)