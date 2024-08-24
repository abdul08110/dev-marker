import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LoginForm } from '@/components/forms/auth/loginForm';

export default function Login() {
    return (
        <section className="h-screen w-screen container">
            <div className="flex justify-center items-center h-full">
                <Card  className="mx-auto max-w-sm border-0">
                    <CardHeader>
                        <CardTitle className="text-2xl text-white">Login</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoginForm />
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}