import * as jwt from "jsonwebtoken";

export class Authenticator {
  public generateToken = (
    input: AuthenticationData,
    expiresIn: string = process.env.ACCESS_TOKEN_EXPIRES_IN!
  ): string => {

    const token = jwt.sign(
      {
        id: input.id,
        name: input.name
      },
      process.env.JWT_KEY as string,
      {
        expiresIn,
      }
    );
    return token;
  }

  public getData = (token: string): AuthenticationData => {
    const payload = jwt.verify(token, process.env.JWT_KEY as string) as any;
    const result = {
      id: payload.id,
      name: payload.name
    };
    return result;
  }
}

export default new Authenticator()

export interface AuthenticationData {
  id: string,
  name: string
}