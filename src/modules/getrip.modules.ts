
export class LoginDTO {
    email: string = "";
    password: string = "";
  }

  export class RegisterDTO {
    email: string = "";
    password: string = "";
    username: string ='';
    name:string='';
    lastname:string='';
    role:string='';
    business:string='';

  }

  export class UsersDTO{
    username: string ='';
    name:string='';
    lastname:string='';
    business:string='';
    password:string='';
    email:string='';
    role:string='';
  }

  export class ServicesDTO{
    description: string ='';
    name:string='';
  }