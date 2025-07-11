export const corsConfiguration = () => {
    const corsOption = {
        origin: ['http://localhost:5173', 'https://rub-chat-tfg.vercel.app'],
        credentials: true,
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
        preflightContinue: false,
        optionsSuccessStatus: 200,
        exposedHeaders: ["Authorization"]
    }

    return corsOption
}