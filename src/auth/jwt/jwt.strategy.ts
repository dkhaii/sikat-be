import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { JWT_CONSTANTS } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      // passport configuration
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // supplies the method by which the JWT will be extracted from the Request
      ignoreExpiration: false, //  just to be explicit, the choosen is the default false setting, which delegates the responsibility of ensuring that a JWT has not expired to the Passport module. This means that if our route is supplied with an expired JWT, the request will be denied and a 401 Unauthorized response sent.
      secretOrKey: JWT_CONSTANTS.secret, //using the expedient option of supplying a symmetric secret for signing the token.
    });
  }

  // Passport first verifies the JWT's signature and decodes the JSON.
  // It then invokes our validate() method passing the decoded JSON as its single parameter.
  async validate(payload: any) {
    return payload;
  }
}
