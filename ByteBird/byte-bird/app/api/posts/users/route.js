import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'users.json');

export async function GET() {
    try {
        if (!fs.existsSync(filePath)) {
            return NextResponse.json([]);
        }
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        
        // Remove passwords before sending to frontend for security
        const safeUsers = data.users.map(({ password, ...user }) => user);
        return NextResponse.json(safeUsers);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json([]);
    }
}