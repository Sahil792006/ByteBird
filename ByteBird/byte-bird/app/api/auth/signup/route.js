import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const filePath = path.join(process.cwd(), 'users.json');

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, email, password } = body;

        // Ensure file exists
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify({ users: [] }));
        }

        const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Check if user exists
        if (fileData.users.find(u => u.email === email)) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { id: Date.now().toString(), username, email, password: hashedPassword };

        fileData.users.push(newUser);
        fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));

        return NextResponse.json({ message: "User created" }, { status: 201 });
    } catch (error) {
        console.error("Signup Error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}