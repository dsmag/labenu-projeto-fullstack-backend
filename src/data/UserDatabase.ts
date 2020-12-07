import { BaseDatabase } from "./BaseDatabase";
import { User } from "../model/User";

export class UserDatabase extends BaseDatabase {
    private static TABLE_NAME = "projeto_fullStack_users";

    public async createUser(
        user: User
    ): Promise<void> {
        try {            
            await this.getConnection()
                .insert({
                    id: user.getId(),
                    name: user.getName(),
                    email: user.getEmail(),
                    nickname: user.getNickname(),
                    password: user.getPassword()
                })
                .into(UserDatabase.TABLE_NAME);
        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    public async getUserByEmailOrNickname(
        input: string
    ): Promise<User> {
        try {
            const result = await this.getConnection()
                .select("*")
                .from(this.tableNames.users)
                .where({ email: input })
                .orWhere({nickname: input})

            return User.toUser(result[0])
        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }
}

export default new UserDatabase()