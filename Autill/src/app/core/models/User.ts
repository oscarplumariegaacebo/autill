// User Model
export class User {
  email: string;
  password: string;

  constructor(password: string, email: string) {
    this.password = password;
    this.email = email;
  }
}