import idGenerator, { IdGenerator } from "../services/IdGenerator";
import hashManager, { HashManager } from "../services/HashManager";
import authenticator, { Authenticator } from "../services/Authenticator";
import userDatabase, { UserDatabase } from "../data/UserDatabase";
import { UserInputDTO, User, LoginInputDTO } from "../model/User";
import { BaseError } from "../error/BaseError";

export class UserBusiness {
    constructor(
        private idGenerator: IdGenerator,
        private hashManager: HashManager,
        private authenticator: Authenticator,
        private userDatabase: UserDatabase
    ) { }

    public createUser = async (input: UserInputDTO): Promise<any> => {
        try {
            const { name, email, nickname, password } = input
            
            if (!name || !email || !nickname || !password) {
                throw new BaseError("Todos os campos são obrigatórios", 422)
            }

            if (email.indexOf("@") === -1) {
                throw new BaseError("Email inválido", 422)
            }

            if (password.length < 6) {
                throw new BaseError("Senha inválida", 422)
            }

            const id = this.idGenerator.generate()
            const hashPassword = await this.hashManager.hash(password)

            await this.userDatabase.createUser(
                User.toUser({
                    id,
                    name,
                    email,
                    nickname,
                    password: hashPassword
                })
            )

            const token = this.authenticator.generateToken({ id })
            
            return token
        } catch (error) {
            throw new BaseError(error.message, error.statusCode)
        }
    }

    public getUserByEmailOrNickname = async (
        input: LoginInputDTO
    ): Promise<any> => {
        try {
            const { emailOrNickname, password} = input

            if (!emailOrNickname || !password) {
                throw new BaseError("Todos os campos são obrigatórios", 422)
            }
        
            const user = await this.userDatabase.getUserByEmailOrNickname(emailOrNickname)

            if (!user) {
                throw new BaseError("Usuário não encontrado ou dados inválidos", 422)
            }

            const hashCompare = await this.hashManager.compare(
                password,
                user.getPassword()
            )

            if (!hashCompare) {
                throw new BaseError("Senha inválida", 422)
            }

            const accessToken = this.authenticator.generateToken({
                id: user.getId()
            })
            
            return { accessToken }
        } catch (error) {
            throw new BaseError(error.message, error.statusCode)
        }
    }
}

export default new UserBusiness(
    idGenerator,
    hashManager,
    authenticator,
    userDatabase
)