import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Vida'ya giriş yap</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Hesabınıza giriş yapmak için aşağıya bilgilerinizi girin
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Sicil</Label>
          <Input id="email" type="text" placeholder="999999" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Parola</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Parolamı unuttum
            </a>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full cursor-pointer">
          Giriş yap
        </Button>
      </div>
      <div className="text-center text-sm">
        Hesabın yok mu?{" "}
        <a href="#" className="underline underline-offset-4">
          Kayıt ol
        </a>
      </div>
    </form>
  );
}
