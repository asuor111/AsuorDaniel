"use server";

import { signIn } from "@/app/(auth)/auth";
import { createUser, getUser } from "@/lib/db/queries";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

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

export async function register(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

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