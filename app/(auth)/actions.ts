"use server";

import { signIn, signOut } from "@/app/(auth)/auth";
import { createUser, getUser } from "@/lib/db/queries";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    revalidatePath("/");
    redirect("/");
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

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const existingUser = await getUser(email);
    if (existingUser.length > 0) {
      return { error: "A user with this email already exists" };
    }

    await createUser(email, password);

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    revalidatePath("/");
    redirect("/");
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