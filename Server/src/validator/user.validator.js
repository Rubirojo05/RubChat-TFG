import z from 'zod'

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

const userShema = z.object({

    firstName: z.string({
        required_error: 'firstName is required',
        invalid_type_error: 'name must be a string'
    }),

    lastName: z.string({
        required_error: 'lastName is required',
        invalid_type_error: 'lastName must be a string'
    }),

    email: z.string().email({
        required_error: 'email is required',
        invalid_type_error: 'email must be a type @email'
    }),

    img: z.object({
        size: z.number(),
        type: z.string(),
    }).refine(file => file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(file => ACCEPTED_IMAGE_MIME_TYPES.includes(file.type), "Only .jpg, .jpeg, .png and .webp formats are supported.").optional(),

    password: z.string({
        required_error: 'password is required'
    }),
    confirmpassword: z.string({
        required_error: 'password is required'
    }),
    roleId: z.string().transform(parseInt).default(2)
    }).refine((data)=>data.password === data.confirmpassword, {
        message: 'password do not match',
        path: ['confirmpassword']
    })

export const validateUser = (object) =>{
    return userShema.safeParse(object)
}