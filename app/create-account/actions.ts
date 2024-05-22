'use server';
import { z } from 'zod';

const passwordRegex = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/
);

const checkUsername = (username: string) => !username.includes('potato');

const checkPassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: 'Username must be a string!',
        required_error: 'Where is my username?',
      })
      .min(3, 'Way too short!!!')
      .max(10, ' That is too loooong!')
      .toLowerCase()
      .trim()
      .transform((username) => `🔥 ${username} 🔥`) // 기본적으로 refine과 동일하게 작동
      .refine(checkUsername, 'No potatoes allowed'),
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      // .min(10)
      .regex(
        passwordRegex,
        'A password must have lowercase, UPPERCASE, a number and special characters'
      ),
    confirm_password: z.string().min(10),
  })
  .refine(checkPassword, {
    message: 'Both passwords should be the same!',
    path: ['confirm_password'],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),
  };
  const result = formSchema.safeParse(data);
  // parse: 에러가 발생하여 try-catch를 통해 에러 처리 필요
  // safeParse: 데이터를 검증하는 건 같지만 에러 발생 x

  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
