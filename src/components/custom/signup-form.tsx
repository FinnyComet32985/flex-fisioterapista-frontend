import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import logo from "@/assets/logo.png";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext.tsx";

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [nome, setNome] = useState("");
    const [cognome, setCognome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { register, isAuthenticated } = useAuth();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await register(nome, cognome, email, password);
            navigate("/");
        } catch (err) {
            setError("Credenziali non valide.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">
                                    Crea il tuo account
                                </h1>
                                <p className="text-muted-foreground text-sm text-balance">
                                    Inserisci la tua email per creare il tuo
                                    account
                                </p>
                            </div>
                            <Field>
                                <Field className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="nome">
                                            Nome
                                        </FieldLabel>
                                        <Input
                                            id="nome"
                                            type="text"
                                            onChange={(e) =>
                                                setNome(e.target.value)
                                            }
                                            required
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="confirm-password">
                                            Cognome
                                        </FieldLabel>
                                        <Input
                                            id="cognome"
                                            type="text"
                                            onChange={(e) =>
                                                setCognome(e.target.value)
                                            }
                                            required
                                        />
                                    </Field>
                                </Field>
                            </Field>
                            <FieldSeparator></FieldSeparator>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">
                                    Password
                                </FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="*********"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </Field>
                            {error && (
                                <p className="text-red-500 text-sm">{error}</p>
                            )}
                            <Field>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading
                                        ? "Registrazione in corso..."
                                        : "Registrati"}
                                </Button>
                            </Field>
                            <FieldDescription className="text-center">
                                Hai già unaccount?{" "}
                                <a href="/login">Accedi ora</a>
                            </FieldDescription>
                        </FieldGroup>
                    </form>
                    <div className="bg-muted relative hidden md:block">
                        <img
                            src={logo}
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
