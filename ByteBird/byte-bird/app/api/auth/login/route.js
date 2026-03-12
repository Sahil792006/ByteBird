import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const filePath = path.join(process.cwd(), 'users.json');
const SECRET_KEY = "bytebird_secret_key_123"; // In production, use an environment variable

export async function POST(request) {
    const { email, password } = await request.json();
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const user = fileData.users.find(u => u.email === email);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // Create Token
    const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    return NextResponse.json({ message: "Login successful", token, username: user.username });
}