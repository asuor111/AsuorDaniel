"use server";

import { signIn, signOut } from "@/app/(auth)/auth";
import { createUser, getUser } from "@/lib/db/queries";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginActionState = {
  error?: string;
  success?: boolean;
};

export type RegisterActionState = {
  error?: string;
  success?: boolean;
};

export async function login(
  prevState: LoginActionState | undefined,
  formData: FormData
): Promise<LoginActionState> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    const validated = authSchema.safeParse({ email, password });
    if (!validated.success) {
      return { error: "Invalid email or password format" };
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Invalid email or password" };
      }
      return { error: "An error occurred during login" };
    }
    return { error: "An unexpected error occurred" };
  }
}

export async function register(
  prevState: RegisterActionState | undefined,
  formData: FormData
): Promise<RegisterActionState> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    const validated = authSchema.safeParse({ email, password });
    if (!validated.success) {
      return { error: "Invalid email or password format" };
    }

    const existingUser = await getUser(email);
    if (existingUser.length > 0) {
      return { error: "A user with this email already exists" };
    }

    await createUser(email, password);
    
    // Auto-login after registration
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "An error occurred during registration" };
    }
    return { error: "An unexpected error occurred" };
  }
}

export async function signOutAction() {
  await signOut();
  redirect("/login");
}