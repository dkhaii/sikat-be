export class AddNewUserRequest {
  id: string;
  password: string;
  name: string;
  role: number;
}

// export class AddNewUserResponse {
//   id: string;
//   name: string;
//   role: number;
//   token?: string;
// }

export class UserResponse {
  id: string;
  name: string;
  role: number;
  token?: string;
}

export class LoginRequest {
  id: string;
  password: string;
}

export class AccessTokenResponse {
  token: string;
}
