"use server"
import bcrypt from 'bcrypt'
import { getCollection } from "@/lib/db";
import { RegisterFormSchema } from "@/lib/rules";
import { redirect } from 'next/navigation';

export async function register(state, formData) {

    //validate form field
    const validatedFields = RegisterFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword")
    })
    //console.log("validatedFields", validatedFields);

    //if any form field are invalid
    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors)
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            email: formData.get("email")
        }
    }

    //extract the form field
    const { email, password } = validatedFields.data;

    //check if the  email is already registered
    const userCollection = await getCollection("users");
    if (!userCollection) return {
        errors: { email: "Server error" }
    }
    const existingUser = await userCollection.findOne({ email })
    if (existingUser) return {
        errors: {
            email: "Email already exist in our database!"
        }
    }
    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //save in database
    const result = await userCollection.insertOne({ email, password: hashedPassword });

    //create a session 


    //redirect to dashboard
    redirect('/dashboard')

}  