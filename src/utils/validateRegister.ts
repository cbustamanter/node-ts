import { UsernamePasswordInput } from "./types/UsernamePasswordInput";

const validateRegister = (options: UsernamePasswordInput) => {
  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "Invalid email ",
      },
    ];
  }

  if (options.username.length <= 3) {
    return [
      {
        field: "username",
        message: "Username should be greaten than 3",
      },
    ];
  }
  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "Username can't include an @",
      },
    ];
  }
  if (options.password.length <= 3) {
    return [
      {
        field: "password",
        message: "Password should be greaten than 3",
      },
    ];
  }
  return null;
};

export default validateRegister;
